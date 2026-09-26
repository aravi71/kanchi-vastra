import 'server-only';
import { redirect } from 'next/navigation';
import { getSession, type ActiveSession } from '@/features/auth/server/session';

/**
 * Every admin page AND every admin Server Action starts with this. Pages are
 * not the security boundary — actions can be called directly — so each
 * action re-checks on its own.
 *
 * Passes only for a live ADMIN-scope session of an active STAFF/ADMIN user
 * who has entered their authenticator code in this session.
 */
export async function requireAdmin(opts: { role?: 'ADMIN' } = {}): Promise<ActiveSession> {
  const session = await getSession('ADMIN');
  if (!session) redirect('/admin/login');
  if (!session.twoFactorPassed) {
    redirect(session.user.twoFactorEnabledAt ? '/admin/verify' : '/admin/setup-2fa');
  }
  if (opts.role === 'ADMIN' && session.user.role !== 'ADMIN') redirect('/admin');
  return session;
}
