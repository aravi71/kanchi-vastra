import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/server/guard';
import { db } from '@/lib/db/prisma';
import { setCustomerActive } from '@/features/admin/actions/customers';
import { Badge, PageTitle } from '@/features/admin/components/ui';

export const metadata: Metadata = { title: 'Customers' };

const fmt = (d: Date | null) =>
  d
    ? d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';

export default async function CustomersPage() {
  await requireAdmin();
  const customers = await db().user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <>
      <PageTitle
        title="Customers"
        description={`${customers.length} registered. Passwords are stored scrambled — nobody, including you, can see them.`}
      />
      <div className="overflow-x-auto rounded-lg border border-ivory-300 bg-white">
        <table className="w-full min-w-[48rem] text-sm">
          <thead className="bg-ivory-100 text-left text-xs text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Last sign-in</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2.5 font-medium">{c.name ?? '—'}</td>
                <td className="px-4 py-2.5">{c.email}</td>
                <td className="px-4 py-2.5 text-ink-500">{c.phone ?? '—'}</td>
                <td className="px-4 py-2.5 text-ink-500">{fmt(c.createdAt)}</td>
                <td className="px-4 py-2.5 text-ink-500">{fmt(c.lastLoginAt)}</td>
                <td className="tnum px-4 py-2.5">{c._count.orders}</td>
                <td className="px-4 py-2.5">
                  <form action={setCustomerActive} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={c.id} />
                    <input type="hidden" name="active" value={String(!c.isActive)} />
                    <Badge tone={c.isActive ? 'ACTIVE' : 'danger'}>
                      {c.isActive ? 'Active' : 'Blocked'}
                    </Badge>
                    <button className="text-xs text-ink-500 underline underline-offset-2 hover:text-ink-900">
                      {c.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-500">
                  No customers yet. They appear here when they create an account on the shop.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
