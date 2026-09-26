'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Heart, User, X } from 'lucide-react';
import { navigation, footerNav } from '@/config/site';
import { useUi } from '@/components/layout/ui-state';
import { useWishlist } from '@/features/wishlist/wishlist-store';
import { Overlay } from '@/components/ui/Overlay';
import { Logo } from '@/components/ui/Logo';
import { SectionDivider } from '@/components/motifs/Motifs';

export function MobileNav() {
  const { isOpen, close } = useUi();
  const pathname = usePathname();
  const { count } = useWishlist();
  const open = isOpen('menu');

  // Close the menu whenever navigation completes.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Overlay open={open} onClose={close} side="left" label="Menu" panelClassName="max-w-[21rem]">
      <div className="flex items-center justify-between border-b border-ivory-300 px-6 py-5">
        <Logo markClassName="text-gold-600" className="origin-left scale-90" />
        <button
          type="button"
          onClick={close}
          className="-mr-2 p-2 transition-opacity hover:opacity-60"
          aria-label="Close menu"
        >
          <X className="size-5" strokeWidth={1.3} />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-7">
        <ul className="space-y-1">
          {navigation.map((item, i) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={active ? 'page' : undefined}
                  className="block py-2.5 font-[family-name:var(--font-display)] text-[1.625rem] leading-tight font-light transition-colors duration-500 hover:text-wine-700"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateX(-12px)',
                    transition: `opacity 600ms ${120 + i * 45}ms cubic-bezier(0.22,1,0.36,1), transform 600ms ${120 + i * 45}ms cubic-bezier(0.22,1,0.36,1), color 500ms`,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <SectionDivider className="my-8" />

        <ul className="space-y-3">
          <li>
            <Link
              href="/wishlist"
              onClick={close}
              className="flex items-center gap-3 py-1 text-sm text-ink-700"
            >
              <Heart className="size-4" strokeWidth={1.3} />
              Wishlist
              {count > 0 && <span className="tnum text-ink-400">({count})</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              onClick={close}
              className="flex items-center gap-3 py-1 text-sm text-ink-700"
            >
              <User className="size-4" strokeWidth={1.3} />
              Account
            </Link>
          </li>
        </ul>

        <SectionDivider className="my-8" />

        <ul className="space-y-2.5">
          {footerNav.help.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                className="text-sm text-ink-500 transition-colors hover:text-ink-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Overlay>
  );
}
