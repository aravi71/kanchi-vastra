import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { ActionForm } from '@/components/ui/ActionForm';
import { db } from '@/lib/db/prisma';
import { changeAdminPassword, signOutOtherSessions } from '@/features/admin/actions/customers';
import { requireAdmin } from '@/features/admin/server/guard';
import { PageTitle, Panel } from '@/features/admin/components/ui';

export const metadata: Metadata = { title: 'Security' };

export default async function SecurityPage() {
  const session = await requireAdmin();
  const sessions = await db().session.findMany({
    where: { userId: session.user.id, expires: { gt: new Date() } },
    orderBy: { lastUsedAt: 'desc' },
    select: { id: true, scope: true, ipAddress: true, userAgent: true, lastUsedAt: true },
  });

  return (
    <>
      <PageTitle title="Security" description="Your admin sign-in settings." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Two-step sign-in">
          <p className="flex items-center gap-2 text-sm text-emerald-800">
            <ShieldCheck className="size-4" /> On since{' '}
            {session.user.twoFactorEnabledAt?.toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Every admin sign-in needs your password and the code from your authenticator app. Lost
            your phone? Your developer can reset it from the server.
          </p>
        </Panel>

        <Panel title="Change password">
          <ActionForm
            action={changeAdminPassword}
            submitLabel="Change password"
            tone="ink"
            fields={[
              {
                name: 'current',
                label: 'Current password',
                type: 'password',
                autoComplete: 'current-password',
                required: true,
              },
              {
                name: 'password',
                label: 'New password',
                type: 'password',
                autoComplete: 'new-password',
                required: true,
                hint: 'At least 10 characters; a short sentence works well.',
              },
            ]}
          />
        </Panel>

        <Panel title="Where you are signed in" className="lg:col-span-2">
          <ul className="divide-y divide-ivory-200 text-sm">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span className="min-w-0 truncate">
                  {s.id === session.id && (
                    <strong className="mr-2 text-emerald-800">This browser</strong>
                  )}
                  {s.scope === 'ADMIN' ? 'Admin' : 'Shop'} · {s.userAgent?.slice(0, 70)} · IP{' '}
                  {s.ipAddress}
                </span>
                <span className="text-xs text-ink-400">
                  {s.lastUsedAt.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </li>
            ))}
          </ul>
          <form action={signOutOtherSessions} className="mt-4">
            <button className="h-9 rounded-md border border-red-300 px-4 text-sm text-red-700 hover:bg-red-50">
              Sign out everywhere else
            </button>
          </form>
        </Panel>
      </div>
    </>
  );
}
