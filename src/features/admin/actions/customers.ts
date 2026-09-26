'use server';

import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/prisma';
import { hashPassword, verifyPassword } from '@/lib/security/crypto';
import { sendMail } from '@/lib/mail/mailer';
import { passwordChangedMail } from '@/lib/mail/templates';
import type { FormState } from '@/components/ui/ActionForm';
import { revokeAllSessions } from '@/features/auth/server/session';
import * as v from '@/features/auth/validation';
import { audit } from '@/features/admin/server/audit';
import { requireAdmin } from '@/features/admin/server/guard';

/** Block or unblock a customer. Blocking signs them out everywhere. */
export async function setCustomerActive(form: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = z.string().min(10).max(40).parse(form.get('userId'));
  const active = form.get('active') === 'true';

  const user = await db().user.findUnique({ where: { id }, select: { email: true, role: true } });
  if (!user || user.role !== 'CUSTOMER') return; // staff accounts are not managed here
  await db().user.update({ where: { id }, data: { isActive: active } });
  if (!active) await revokeAllSessions(id);
  await audit(session, active ? 'customer.unblock' : 'customer.block', 'User', id, {
    email: user.email,
  });
  revalidatePath('/admin/customers');
}

/** The signed-in admin changes their own password; other sessions end. */
export async function changeAdminPassword(_: FormState, form: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = z
    .object({ current: z.string().min(1).max(128), password: v.password })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: v.fieldErrors(parsed.error) };

  const user = await db().user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { fieldErrors: { current: 'Your current password is not correct.' } };
  }
  await db().user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });
  await revokeAllSessions(user.id, session.id);
  await audit(session, 'admin.password_change', 'User', user.id);
  after(() => sendMail(passwordChangedMail(user.email)));
  return { ok: 'Password changed. All other sessions were signed out.' };
}

/** Sign this admin out of every other browser and device. */
export async function signOutOtherSessions(): Promise<void> {
  const session = await requireAdmin();
  await revokeAllSessions(session.user.id, session.id);
  await audit(session, 'admin.sessions_revoked', 'User', session.user.id);
  revalidatePath('/admin/security');
}
