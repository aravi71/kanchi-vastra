import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/server/guard';
import { Package } from 'lucide-react';
import { db } from '@/lib/db/prisma';
import { formatPrice } from '@/lib/utils';
import { PageTitle, Panel } from '@/features/admin/components/ui';

export const metadata: Metadata = { title: 'Orders' };

export default async function OrdersPage() {
  await requireAdmin();
  const orders = await db().order.findMany({
    orderBy: { placedAt: 'desc' },
    take: 100,
    select: {
      id: true,
      orderNumber: true,
      email: true,
      status: true,
      paymentStatus: true,
      total: true,
      placedAt: true,
    },
  });

  return (
    <>
      <PageTitle title="Orders" />
      {orders.length === 0 ? (
        <Panel>
          <Package className="size-7 text-ivory-400" strokeWidth={1} />
          <p className="mt-3 text-sm text-ink-600">
            No orders yet. Orders appear here once online payment (Razorpay) is switched on — that
            needs your Razorpay account first.
          </p>
        </Panel>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ivory-300 bg-white">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-ivory-100 text-left text-xs text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-2.5 font-medium">#{o.orderNumber}</td>
                  <td className="px-4 py-2.5">{o.email}</td>
                  <td className="px-4 py-2.5 text-ink-500">
                    {o.placedAt.toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">{o.status}</td>
                  <td className="px-4 py-2.5">{o.paymentStatus}</td>
                  <td className="tnum px-4 py-2.5 text-right">{formatPrice(Number(o.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
