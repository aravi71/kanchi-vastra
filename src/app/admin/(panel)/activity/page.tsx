import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/server/guard';
import { db } from '@/lib/db/prisma';
import { Badge, PageTitle, Panel } from '@/features/admin/components/ui';

export const metadata: Metadata = { title: 'Activity log' };

const fmt = (d: Date) =>
  d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' });

type Changes = Record<string, { from: unknown; to: unknown }>;

export default async function ActivityPage() {
  await requireAdmin();
  const [changes, logins] = await Promise.all([
    db().auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    db().loginAttempt.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
  ]);

  return (
    <>
      <PageTitle
        title="Activity log"
        description="Every change made in the admin panel, and every sign-in attempt. Entries cannot be edited or deleted from here."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel title="Changes">
          <ul className="divide-y divide-ivory-200 text-sm">
            {changes.map((a) => {
              const details = (a.details ?? {}) as { name?: string; changes?: Changes };
              return (
                <li key={a.id} className="py-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">
                      {a.action} {details.name ? `· ${details.name}` : ''}
                    </span>
                    <span className="text-xs text-ink-400">{fmt(a.createdAt)}</span>
                  </div>
                  <p className="text-xs text-ink-500">
                    by {a.actorEmail} · IP {a.ip ?? '—'}
                  </p>
                  {details.changes && Object.keys(details.changes).length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 text-xs text-ink-600">
                      {Object.entries(details.changes).map(([field, c]) => (
                        <li key={field}>
                          <span className="font-medium">{field}</span>: {String(c.from ?? '—')} →{' '}
                          {String(c.to ?? '—')}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {changes.length === 0 && <li className="py-3 text-ink-500">No changes yet.</li>}
          </ul>
        </Panel>
        <Panel title="Sign-in attempts">
          <ul className="divide-y divide-ivory-200 text-sm">
            {logins.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="min-w-0 truncate">
                  {l.email}{' '}
                  <span className="text-xs text-ink-400">
                    ({l.scope === 'ADMIN' ? 'admin' : 'shop'}, IP {l.ip})
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Badge tone={l.success ? 'ACTIVE' : 'danger'}>
                    {l.success ? 'OK' : 'Failed'}
                  </Badge>
                  <span className="text-xs text-ink-400">{fmt(l.createdAt)}</span>
                </span>
              </li>
            ))}
            {logins.length === 0 && <li className="py-3 text-ink-500">No sign-ins yet.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}
