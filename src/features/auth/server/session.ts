import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import type { Role, SessionScope, User } from '@prisma/client';
import { isProduction } from '@/config/env.server';
import { db } from '@/lib/db/prisma';
import { randomToken, sha256 } from '@/lib/security/crypto';
import { requestContext } from '@/lib/security/request';

/* ===========================================================================
   SESSIONS
   ---------------------------------------------------------------------------
   The browser holds a random 256-bit token in an httpOnly cookie; the
   database stores only its SHA-256, so a copied database cannot be used to
   sign in. Customer and admin sessions are separate cookies:

                 cookie                path     SameSite  lifetime
     customer    __Host-kv_session     /        Lax       30 days
     admin       __Secure-kv_admin     /admin   Strict    12 h, 60 min idle

   The admin cookie is never sent with storefront requests, and an admin
   session is unusable until the authenticator code has been entered.
   =========================================================================== */

type Scope = SessionScope;

const POLICY = {
  CUSTOMER: {
    cookie: isProduction ? '__Host-kv_session' : 'kv_session',
    path: '/',
    sameSite: 'lax' as const,
    maxAgeSeconds: 30 * 24 * 3600,
    idleSeconds: null,
  },
  ADMIN: {
    cookie: isProduction ? '__Secure-kv_admin' : 'kv_admin',
    path: '/admin',
    sameSite: 'strict' as const,
    maxAgeSeconds: 12 * 3600,
    idleSeconds: 60 * 60,
  },
} satisfies Record<Scope, unknown>;

export const STAFF_ROLES: Role[] = ['ADMIN', 'STAFF'];

export interface ActiveSession {
  id: string;
  scope: Scope;
  twoFactorPassed: boolean;
  user: Pick<User, 'id' | 'email' | 'name' | 'phone' | 'role' | 'twoFactorEnabledAt'>;
}

export async function createSession(
  userId: string,
  scope: Scope,
  opts: { twoFactorPassed?: boolean } = {},
): Promise<void> {
  const policy = POLICY[scope];
  const token = randomToken();
  const { ip, userAgent } = await requestContext();

  await db().session.create({
    data: {
      sessionToken: sha256(token),
      userId,
      scope,
      twoFactorPassed: opts.twoFactorPassed ?? false,
      expires: new Date(Date.now() + policy.maxAgeSeconds * 1000),
      ipAddress: ip,
      userAgent,
    },
  });

  (await cookies()).set(policy.cookie, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: policy.sameSite,
    path: policy.path,
    maxAge: policy.maxAgeSeconds,
  });
}

/** The signed-in session for a scope, or null. Cached for the request. */
export const getSession = cache(async (scope: Scope): Promise<ActiveSession | null> => {
  const policy = POLICY[scope];
  const token = (await cookies()).get(policy.cookie)?.value;
  if (!token || token.length > 100) return null;

  const row = await db().session.findUnique({
    where: { sessionToken: sha256(token) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          twoFactorEnabledAt: true,
        },
      },
    },
  });
  if (!row || row.scope !== scope) return null;

  const now = Date.now();
  const idleExpired =
    policy.idleSeconds !== null && now - row.lastUsedAt.getTime() > policy.idleSeconds * 1000;
  const staffOnly = scope === 'ADMIN' && !STAFF_ROLES.includes(row.user.role);
  if (row.expires.getTime() < now || idleExpired || !row.user.isActive || staffOnly) {
    await db()
      .session.delete({ where: { id: row.id } })
      .catch(() => {});
    return null;
  }

  // Record activity at most once a minute (keeps writes cheap).
  if (now - row.lastUsedAt.getTime() > 60_000) {
    await db()
      .session.update({ where: { id: row.id }, data: { lastUsedAt: new Date() } })
      .catch(() => {});
  }

  const { isActive: _active, ...user } = row.user;
  return { id: row.id, scope: row.scope, twoFactorPassed: row.twoFactorPassed, user };
});

export async function markTwoFactorPassed(sessionId: string): Promise<void> {
  await db().session.update({
    where: { id: sessionId },
    data: { twoFactorPassed: true, lastUsedAt: new Date() },
  });
}

/** Signs out this browser for the given scope. */
export async function destroySession(scope: Scope): Promise<void> {
  const policy = POLICY[scope];
  const jar = await cookies();
  const token = jar.get(policy.cookie)?.value;
  if (token) await db().session.deleteMany({ where: { sessionToken: sha256(token) } });
  jar.set(policy.cookie, '', {
    path: policy.path,
    maxAge: 0,
    httpOnly: true,
    secure: isProduction,
    sameSite: policy.sameSite,
  });
}

/** Signs a user out everywhere (after a password change or when disabled). */
export async function revokeAllSessions(userId: string, exceptSessionId?: string): Promise<void> {
  await db().session.deleteMany({
    where: { userId, ...(exceptSessionId ? { NOT: { id: exceptSessionId } } : {}) },
  });
}
