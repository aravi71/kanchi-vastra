import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/server/guard';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { db } from '@/lib/db/prisma';
import { formatPrice } from '@/lib/utils';
import { Badge, PageTitle, statusLabel } from '@/features/admin/components/ui';

export const metadata: Metadata = { title: 'Sarees' };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin();
  const { q = '', status = '' } = await searchParams;
  const term = q.trim().slice(0, 80);

  const products = await db().product.findMany({
    where: {
      ...(term
        ? {
            OR: [
              { name: { contains: term, mode: 'insensitive' } },
              { sku: { contains: term, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(status === 'ACTIVE' || status === 'DRAFT' || status === 'ARCHIVED' ? { status } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
      variants: {
        where: { isActive: true },
        select: { inventory: { select: { quantity: true } } },
      },
    },
  });

  return (
    <>
      <PageTitle
        title="Sarees"
        description={`${products.length} shown. Click a saree to change its price, stock, details or photos.`}
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-wine-800 px-4 text-sm text-ivory-50 hover:bg-wine-950"
          >
            <Plus className="size-4" /> Add a saree
          </Link>
        }
      />

      <form className="mb-5 flex flex-wrap gap-3" role="search">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
          <input
            name="q"
            defaultValue={term}
            placeholder="Search name or stock code"
            className="h-10 w-full rounded-md border border-ivory-300 bg-white pr-3 pl-9 text-sm focus:border-wine-700 focus:outline-none"
          />
        </label>
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-md border border-ivory-300 bg-white px-3 text-sm"
        >
          <option value="">All</option>
          <option value="ACTIVE">On sale</option>
          <option value="DRAFT">Drafts</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button className="h-10 rounded-md border border-ink-900/20 px-4 text-sm hover:bg-ink-900 hover:text-ivory-50">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-ivory-300 bg-white">
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="bg-ivory-100 text-left text-xs text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">Saree</th>
              <th className="px-4 py-3 font-medium">Stock code</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">In stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {products.map((p) => {
              const stock = p.variants.reduce((n, v) => n + (v.inventory?.quantity ?? 0), 0);
              return (
                <tr key={p.id} className="hover:bg-ivory-50">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex items-center gap-3 font-medium hover:text-wine-800"
                    >
                      <span className="relative block h-14 w-11 shrink-0 overflow-hidden rounded bg-ivory-200">
                        {p.images[0] && (
                          <Image
                            src={p.images[0].url}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        )}
                      </span>
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-500">{p.sku}</td>
                  <td className="tnum px-4 py-2.5 text-right">{formatPrice(Number(p.price))}</td>
                  <td className="tnum px-4 py-2.5 text-right">
                    {stock === 0 ? (
                      <Badge tone="danger">Sold out</Badge>
                    ) : stock <= 2 ? (
                      <span className="text-amber-700">{stock} (low)</span>
                    ) : (
                      stock
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge tone={p.status}>{statusLabel[p.status]}</Badge>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-500">
                  No sarees match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
