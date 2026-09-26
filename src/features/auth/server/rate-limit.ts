import 'server-only';
import type { SessionScope } from '@prisma/client';
import { db } from '@/lib/db/prisma';

/**
 * Brute-force protection, stored in the database so it holds across restarts
 * and across several app containers.
 *
 *   per email:  5 failed sign-ins in 15 minutes  -> paused for 15 minutes
 *   per IP:    20 failed sign-ins in 15 minutes  -> paused for 15 minutes
 *
 * Messages never say which limit was hit or whether the email exists.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

export async function tooManyAttempts(email: string, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const [byEmail, byIp] = await Promise.all([
    db().loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    db().loginAttempt.count({ where: { ip, success: false, createdAt: { gte: since } } }),
  ]);
  return byEmail >= MAX_PER_EMAIL || byIp >= MAX_PER_IP;
}

export async function recordAttempt(
  email: string,
  ip: string,
  scope: SessionScope,
  success: boolean,
): Promise<void> {
  await db().loginAttempt.create({ data: { email, ip, scope, success } });
  // Old rows are useless for limiting; keep 90 days for the security log.
  if (Math.random() < 0.01) {
    await db()
      .loginAttempt.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 90 * 24 * 3600 * 1000) } },
      })
      .catch(() => {});
  }
}
