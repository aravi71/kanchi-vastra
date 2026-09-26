import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Heart, Package } from 'lucide-react';
import { ActionForm } from '@/components/ui/ActionForm';
import { changePassword, logout, updateProfile } from '@/features/auth/actions/customer';
import { getSession } from '@/features/auth/server/session';
import { db } from '@/lib/db/prisma';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'My account', robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await getSession('CUSTOMER');
  if (!session) redirect('/account/login?next=/account');
  const { user } = session;

  const orders = await db().order.findMany({
    where: { userId: user.id },
    orderBy: { placedAt: 'desc' },
    take: 10,
    select: { id: true, orderNumber: true, status: true, total: true, placedAt: true },
  });

  return (
    <div className="container-editorial pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ivory-300 pb-8">
        <div>
          <p className="eyebrow text-gold-700">My account</p>
          <h1 className="display-lg mt-2 font-light">Hello{user.name ? `, ${user.name}` : ''}</h1>
          <p className="mt-2 text-sm text-ink-500">{user.email}</p>
        </div>
        <form action={logout}>
          <button className="eyebrow h-11 border border-ink-900/25 px-6 transition-colors hover:bg-ink-900 hover:text-ivory-50">
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section>
          <h2 className="display-sm font-light">Your orders</h2>
          {orders.length === 0 ? (
            <div className="mt-6 border border-ivory-300 bg-ivory-100 p-8 text-sm text-ink-500">
              <Package className="size-7 text-ivory-400" strokeWidth={1} />
              <p className="mt-4">
                No orders yet. When online payment opens, your orders and their delivery status will
                appear here.
              </p>
              <div className="mt-6 flex flex-wrap gap-5">
                <Link href="/shop" className="eyebrow link-underline text-wine-800">
                  Browse sarees
                </Link>
                <Link
                  href="/wishlist"
                  className="eyebrow link-underline inline-flex items-center gap-2 text-ink-700"
                >
                  <Heart className="size-3.5" /> Wishlist
                </Link>
              </div>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-ivory-300 border-y border-ivory-300">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap justify-between gap-3 py-4 text-sm">
                  <span className="font-medium">#{o.orderNumber}</span>
                  <span className="text-ink-500">{o.placedAt.toLocaleDateString('en-IN')}</span>
                  <span className="eyebrow-sm text-ink-600">{o.status}</span>
                  <span className="tnum">{formatPrice(Number(o.total))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-12">
          <section>
            <h2 className="display-sm font-light">Your details</h2>
            <div className="mt-6">
              <ActionForm
                action={updateProfile}
                submitLabel="Save details"
                fields={[
                  {
                    name: 'name',
                    label: 'Full name',
                    autoComplete: 'name',
                    required: true,
                    defaultValue: user.name ?? '',
                  },
                  {
                    name: 'phone',
                    label: 'Mobile',
                    type: 'tel',
                    autoComplete: 'tel',
                    defaultValue: user.phone ?? '',
                  },
                ]}
              />
            </div>
          </section>
          <section>
            <h2 className="display-sm font-light">Change password</h2>
            <div className="mt-6">
              <ActionForm
                action={changePassword}
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
                    hint: 'At least 10 characters.',
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
