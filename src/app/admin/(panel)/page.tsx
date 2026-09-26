import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Package, Plus, Shirt, Users } from 'lucide-react';
import { db } from '@/lib/db/prisma';
import { requireAdmin } from '@/features/admin/server/guard';
import { PageTitle, Panel } from '@/features/admin/components/ui';

/** Outside the component: a server page is rendered per request anyway. */
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000);

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const since = hoursAgo(24);

  const [onSale, drafts, lowStock, customers, orders, failedLogins, recent] = await Promise.all([
    db().product.count({ where: { status: 'ACTIVE' } }),
    db().product.count({ where: { status: 'DRAFT' } }),
    db().product.findMany({
      where: {
        status: 'ACTIVE',
        variants: { some: { isActive: true, inventory: { quantity: { lte: 2 } } } },
      },
      select: {
        id: true,
        name: true,
        variants: {
          where: { isActive: true },
          select: { inventory: { select: { quantity: true } } },
        },
      },
      take: 8,
    }),
    db().user.count({ where: { role: 'CUSTOMER' } }),
    db().order.count(),
    db().loginAttempt.count({ where: { success: false, createdAt: { gte: since } } }),
    db().auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  const tiles = [
    {
      label: 'Sarees on sale',
      value: onSale,
      note: `${drafts} draft${drafts === 1 ? '' : 's'}`,
      href: '/admin/products',
      icon: Shirt,
    },
    {
      label: 'Customers',
      value: customers,
      note: 'registered accounts',
      href: '/admin/customers',
      icon: Users,
    },
    {
      label: 'Orders',
      value: orders,
      note: 'online payment not live yet',
      href: '/admin/orders',
      icon: Package,
    },
    {
      label: 'Failed sign-ins (24 h)',
      value: failedLogins,
      note: 'customers and staff',
      href: '/admin/activity',
      icon: AlertTriangle,
    },
  ];

  return (
    <>
      <PageTitle
        title={`Welcome${session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}`}
        description="Your shop at a glance."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-wine-800 px-4 text-sm text-ivory-50 hover:bg-wine-950"
          >
            <Plus className="size-4" /> Add a saree
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, note, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border border-ivory-300 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <Icon className="size-5 text-wine-800" strokeWidth={1.5} />
            <p className="tnum mt-3 font-display text-4xl">{value}</p>
            <p className="mt-1 text-sm font-medium">{label}</p>
            <p className="text-xs text-ink-400">{note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Running low (2 or fewer)">
          {lowStock.length === 0 ? (
            <p className="text-sm text-ink-500">Nothing is running low.</p>
          ) : (
            <ul className="divide-y divide-ivory-200 text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between py-2">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-wine-800">
                    {p.name}
                  </Link>
                  <span className="tnum text-amber-700">
                    {p.variants.reduce((n, v) => n + (v.inventory?.quantity ?? 0), 0)} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Recent changes">
          {recent.length === 0 ? (
            <p className="text-sm text-ink-500">No changes yet.</p>
          ) : (
            <ul className="divide-y divide-ivory-200 text-sm">
              {recent.map((a) => (
                <li key={a.id} className="flex justify-between gap-3 py-2">
                  <span className="truncate">
                    {a.action.replace('.', ' ')} ·{' '}
                    {(a.details as { name?: string } | null)?.name ?? a.entity}
                  </span>
                  <span className="shrink-0 text-xs text-ink-400">
                    {a.createdAt.toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
