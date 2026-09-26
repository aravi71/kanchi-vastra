'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  Shirt,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { adminLogout } from '@/features/admin/actions/auth';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Sarees', icon: Shirt },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/activity', label: 'Activity log', icon: History },
  { href: '/admin/security', label: 'Security', icon: ShieldCheck },
];

export function AdminNav({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-ivory-300 bg-wine-950 text-ivory-100 md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-5 py-5 md:block md:px-6 md:py-8">
        <div>
          <p className="font-display text-xl">Kanchi Vastra</p>
          <p className="eyebrow-sm mt-1 text-gold-400">Admin</p>
        </div>
        <form action={adminLogout} className="md:hidden">
          <button className="eyebrow-sm flex items-center gap-2 text-ivory-200">
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </div>

      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:px-3">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-ivory-50/12 text-ivory-50'
                  : 'text-ivory-200/75 hover:bg-ivory-50/6 hover:text-ivory-50',
              )}
            >
              <Icon className="size-4" strokeWidth={1.6} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden px-6 pt-10 md:block">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-ivory-200/70 hover:text-ivory-50"
        >
          <ExternalLink className="size-3.5" /> View the shop
        </Link>
        <div className="mt-8 border-t border-ivory-50/10 pt-5 text-xs text-ivory-200/60">
          <p className="truncate text-ivory-100">{name}</p>
          <p className="mt-0.5">{role === 'ADMIN' ? 'Administrator' : 'Staff'}</p>
          <form action={adminLogout} className="mt-4">
            <button className="flex items-center gap-2 text-ivory-200/80 hover:text-ivory-50">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
