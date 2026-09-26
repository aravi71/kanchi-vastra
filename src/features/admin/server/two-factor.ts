import 'server-only';
import { db } from '@/lib/db/prisma';
import { decrypt, encrypt } from '@/lib/security/crypto';
import { newTotpSecret } from '@/lib/security/totp';

/**
 * The secret shown as a QR code while an admin connects their authenticator
 * app. Created once, stored encrypted, inactive until a code confirms it.
 *
 * Deliberately NOT in a 'use server' file: everything exported from one is a
 * public endpoint, and this returns a secret.
 */
export async function pendingTwoFactorSecret(userId: string): Promise<string> {
  const user = await db().user.findUniqueOrThrow({ where: { id: userId } });
  if (user.twoFactorEnabledAt) throw new Error('Two-factor authentication is already enabled.');
  if (user.twoFactorSecret) return decrypt(user.twoFactorSecret);
  const secret = newTotpSecret();
  await db().user.update({ where: { id: userId }, data: { twoFactorSecret: encrypt(secret) } });
  return secret;
}
