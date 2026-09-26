'use server';

import { after } from 'next/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db/prisma';
import { decrypt, verifyPassword } from '@/lib/security/crypto';
import { requestContext } from '@/lib/security/request';
import { verifyTotp } from '@/lib/security/totp';
import { sendMail } from '@/lib/mail/mailer';
import { signInAlertMail } from '@/lib/mail/templates';
import type { FormState } from '@/components/ui/ActionForm';
import { recordAttempt, tooManyAttempts } from '@/features/auth/server/rate-limit';
import {
  createSession,
  destroySession,
  getSession,
  markTwoFactorPassed,
  STAFF_ROLES,
} from '@/features/auth/server/session';
import * as v from '@/features/auth/validation';

const TOO_MANY = 'Too many attempts. Please wait 15 minutes and try again.';

/* --- step 1: email + password -------------------------------------------- */

const loginSchema = z.object({ email: v.email, password: z.string().min(1).max(128) });

export async function adminLogin(_: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: 'Enter your email and password.' };
  const { email, password } = parsed.data;
  const { ip } = await requestContext();

  if (await tooManyAttempts(email, ip)) return { error: TOO_MANY };

  const user = await db().user.findUnique({ where: { email } });
  const valid = await verifyPassword(password, user?.passwordHash);
  // Customers get the same message as a wrong password: the admin login
  // never confirms which emails belong to staff.
  if (!user || !valid || !user.isActive || !STAFF_ROLES.includes(user.role)) {
    await recordAttempt(email, ip, 'ADMIN', false);
    return { error: 'Email or password is incorrect.' };
  }

  await createSession(user.id, 'ADMIN', { twoFactorPassed: false });
  redirect(user.twoFactorEnabledAt ? '/admin/verify' : '/admin/setup-2fa');
}

/* --- step 2a: code from the authenticator app ----------------------------- */

export async function verifyTwoFactor(_: FormState, form: FormData): Promise<FormState> {
  const session = await getSession('ADMIN');
  if (!session) redirect('/admin/login');
  const parsed = v.otp.safeParse(form.get('code'));
  if (!parsed.success) return { fieldErrors: { code: parsed.error.issues[0].message } };

  const { ip, userAgent } = await requestContext();
  const email = session.user.email;
  if (await tooManyAttempts(email, ip)) return { error: TOO_MANY };

  const user = await db().user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!user.twoFactorSecret || !user.twoFactorEnabledAt) redirect('/admin/setup-2fa');

  if (!verifyTotp(decrypt(user.twoFactorSecret), parsed.data)) {
    await recordAttempt(email, ip, 'ADMIN', false);
    return { fieldErrors: { code: 'That code is not correct. Codes change every 30 seconds.' } };
  }

  await recordAttempt(email, ip, 'ADMIN', true);
  await markTwoFactorPassed(session.id);
  await db().user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  after(() => sendMail(signInAlertMail(email, { ip, userAgent, at: new Date(), admin: true })));
  redirect('/admin');
}

/* --- step 2b: first sign-in — connect an authenticator app ----------------- */

export async function confirmTwoFactorSetup(_: FormState, form: FormData): Promise<FormState> {
  const session = await getSession('ADMIN');
  if (!session) redirect('/admin/login');
  if (session.user.twoFactorEnabledAt) redirect('/admin/verify');
  const parsed = v.otp.safeParse(form.get('code'));
  if (!parsed.success) return { fieldErrors: { code: parsed.error.issues[0].message } };

  const { ip, userAgent } = await requestContext();
  const user = await db().user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!user.twoFactorSecret || !verifyTotp(decrypt(user.twoFactorSecret), parsed.data)) {
    await recordAttempt(user.email, ip, 'ADMIN', false);
    return {
      fieldErrors: {
        code: 'That code is not correct. Check the app shows "Kanchi Vastra" and try the newest code.',
      },
    };
  }

  await db().user.update({
    where: { id: user.id },
    data: { twoFactorEnabledAt: new Date(), lastLoginAt: new Date() },
  });
  await recordAttempt(user.email, ip, 'ADMIN', true);
  await markTwoFactorPassed(session.id);
  after(() =>
    sendMail(signInAlertMail(user.email, { ip, userAgent, at: new Date(), admin: true })),
  );
  redirect('/admin');
}

export async function adminLogout(): Promise<void> {
  await destroySession('ADMIN');
  redirect('/admin/login');
}
