'use server';

import { after } from 'next/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { site } from '@/config/site';
import { db } from '@/lib/db/prisma';
import { hashPassword, randomToken, sha256, verifyPassword } from '@/lib/security/crypto';
import { requestContext } from '@/lib/security/request';
import { sendMail } from '@/lib/mail/mailer';
import {
  passwordChangedMail,
  passwordResetMail,
  signInAlertMail,
  welcomeMail,
} from '@/lib/mail/templates';
import { recordAttempt, tooManyAttempts } from '@/features/auth/server/rate-limit';
import {
  createSession,
  destroySession,
  getSession,
  revokeAllSessions,
} from '@/features/auth/server/session';
import * as v from '@/features/auth/validation';
import type { FormState } from '@/components/ui/ActionForm';

const TOO_MANY = 'Too many attempts. Please wait 15 minutes and try again.';
const RESET_PREFIX = 'reset:';

/** Only same-site paths, never "//evil.com" or absolute URLs. */
function safeNext(value: FormDataEntryValue | null, fallback = '/account'): string {
  const s = typeof value === 'string' ? value : '';
  return s.startsWith('/') && !s.startsWith('//') && !s.startsWith('/\\') ? s : fallback;
}

/* --- register ------------------------------------------------------------- */

const registerSchema = z.object({
  name: v.name,
  email: v.email,
  password: v.password,
  phone: v.phone,
});

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: v.fieldErrors(parsed.error) };
  const { name, email, password, phone } = parsed.data;
  const { ip } = await requestContext();

  if (await tooManyAttempts(email, ip)) return { error: TOO_MANY };
  if (password.toLowerCase().includes(email.split('@')[0])) {
    return { fieldErrors: { password: 'Your password must not contain your email name.' } };
  }

  const exists = await db().user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    await recordAttempt(email, ip, 'CUSTOMER', false);
    return { error: 'An account with this email already exists. Sign in, or reset your password.' };
  }

  const user = await db().user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await hashPassword(password),
      lastLoginAt: new Date(),
    },
  });
  await recordAttempt(email, ip, 'CUSTOMER', true);
  await createSession(user.id, 'CUSTOMER');
  after(() => sendMail(welcomeMail(email, name)));
  redirect(safeNext(form.get('next')));
}

/* --- sign in / out -------------------------------------------------------- */

const loginSchema = z.object({ email: v.email, password: z.string().min(1).max(128) });

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: 'Enter your email and password.' };
  const { email, password } = parsed.data;
  const { ip, userAgent } = await requestContext();

  if (await tooManyAttempts(email, ip)) return { error: TOO_MANY };

  const user = await db().user.findUnique({ where: { email } });
  const valid = await verifyPassword(password, user?.passwordHash);
  if (!user || !valid || !user.isActive) {
    await recordAttempt(email, ip, 'CUSTOMER', false);
    return { error: 'Email or password is incorrect.' };
  }

  await recordAttempt(email, ip, 'CUSTOMER', true);
  await db().user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user.id, 'CUSTOMER');
  after(() => sendMail(signInAlertMail(email, { ip, userAgent, at: new Date(), admin: false })));
  redirect(safeNext(form.get('next')));
}

export async function logout(): Promise<void> {
  await destroySession('CUSTOMER');
  redirect('/');
}

/* --- forgotten password --------------------------------------------------- */

export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  const parsed = v.email.safeParse(form.get('email'));
  if (!parsed.success) return { fieldErrors: { email: 'Enter a valid email address.' } };
  const email = parsed.data;
  const { ip } = await requestContext();
  const generic: FormState = {
    ok: 'If an account exists for that email, a reset link is on its way. It works for 30 minutes.',
  };

  if (await tooManyAttempts(email, ip)) return { error: TOO_MANY };
  // Counted like a failed sign-in so the form cannot be used to spam inboxes.
  await recordAttempt(email, ip, 'CUSTOMER', false);

  const user = await db().user.findUnique({ where: { email }, select: { isActive: true } });
  if (!user?.isActive) return generic;

  const token = randomToken();
  await db().verificationToken.deleteMany({ where: { identifier: RESET_PREFIX + email } });
  await db().verificationToken.create({
    data: {
      identifier: RESET_PREFIX + email,
      token: sha256(token),
      expires: new Date(Date.now() + 30 * 60 * 1000),
    },
  });
  after(() => sendMail(passwordResetMail(email, `${site.url}/account/reset?token=${token}`)));
  return generic;
}

const resetSchema = z.object({ token: z.string().min(20).max(100), password: v.password });

export async function resetPassword(_: FormState, form: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: v.fieldErrors(parsed.error) };

  const row = await db().verificationToken.findUnique({
    where: { token: sha256(parsed.data.token) },
  });
  if (!row || !row.identifier.startsWith(RESET_PREFIX) || row.expires < new Date()) {
    return { error: 'This reset link has expired or was already used. Ask for a new one.' };
  }
  const email = row.identifier.slice(RESET_PREFIX.length);

  const user = await db().user.update({
    where: { email },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });
  await db().verificationToken.delete({ where: { token: row.token } });
  await revokeAllSessions(user.id);
  after(() => sendMail(passwordChangedMail(email)));
  redirect('/account/login?reset=1');
}

/* --- profile -------------------------------------------------------------- */

const profileSchema = z.object({ name: v.name, phone: v.phone });

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const session = await getSession('CUSTOMER');
  if (!session) redirect('/account/login');
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: v.fieldErrors(parsed.error) };

  await db().user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });
  return { ok: 'Your details are saved.' };
}

const changePasswordSchema = z.object({
  current: z.string().min(1).max(128),
  password: v.password,
});

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const session = await getSession('CUSTOMER');
  if (!session) redirect('/account/login');
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(form));
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
  after(() => sendMail(passwordChangedMail(user.email)));
  return { ok: 'Password changed. Other devices have been signed out.' };
}
