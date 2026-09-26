'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { navigation } from '@/config/site';
import { useCart } from '@/features/cart/cart-store';
import { useWishlist } from '@/features/wishlist/wishlist-store';
import { useUi } from '@/components/layout/ui-state';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

/** Pages that render a full-bleed hero the header should float over. */
const TRANSPARENT_ROUTES = ['/'];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { count: cartCount, hydrated: cartReady } = useCart();
  const { count: wishCount, hydrated: wishReady } = useWishlist();
  const { open } = useUi();

  const overHero = TRANSPARENT_ROUTES.includes(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        overHero
          ? 'border-b border-ivory-100/15 bg-transparent text-ivory-100'
          : 'border-b border-ivory-300 bg-ivory-100/95 text-ink-900 backdrop-blur-md',
      )}
    >
      {/* Announcement rail — the only place the brand speaks in the first person. */}
      <div
        className={cn(
          'overflow-hidden border-b transition-all duration-700',
          overHero
            ? 'max-h-10 border-ivory-100/15 bg-wine-950/25'
            : 'max-h-0 border-transparent md:max-h-10 md:bg-wine-900',
        )}
      >
        <p className="eyebrow-sm container-editorial flex h-10 items-center justify-center text-center text-ivory-100/85">
          <span className="md:hidden">Free shipping above ₹15,000</span>
          <span className="hidden md:inline">
            Complimentary shipping on orders above ₹15,000 · Pan-India delivery
          </span>
        </p>
      </div>

      <div className="container-editorial">
        <div className="flex h-[68px] items-center justify-between gap-3 md:h-[84px] lg:gap-6">
          {/* --- mobile: menu --- */}
          <button
            type="button"
            onClick={() => open('menu')}
            className="-ml-2 p-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-[22px]" strokeWidth={1.25} />
          </button>

          {/* --- logo --- */}
          <Link href="/" className="shrink-0 lg:flex-none" aria-label="Kanchi Vastra — home">
            <Logo
              className="scale-[0.86] md:scale-100"
              markClassName={overHero ? 'text-gold-400' : 'text-gold-600'}
            />
          </Link>

          {/* --- desktop navigation --- */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-9">
              {navigation.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li
                    key={item.href}
                    className={cn(
                      // Seven items plus the logo and four icons do not breathe
                      // below 1280px. "Home" is the first to go — the logo
                      // already links there.
                      item.href === '/' && 'hidden xl:block',
                    )}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'eyebrow-sm link-underline py-1 whitespace-nowrap transition-opacity duration-500',
                        active ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* --- actions --- */}
          <div className="flex items-center gap-0.5 md:gap-1.5">
            <button
              type="button"
              onClick={() => open('search')}
              className="p-2 transition-opacity duration-500 hover:opacity-60"
              aria-label="Search"
            >
              <Search className="size-[19px]" strokeWidth={1.25} />
            </button>

            <Link
              href="/account"
              className="hidden p-2 transition-opacity duration-500 hover:opacity-60 md:block"
              aria-label="Account"
            >
              <User className="size-[19px]" strokeWidth={1.25} />
            </Link>

            <Link
              href="/wishlist"
              className="relative hidden p-2 transition-opacity duration-500 hover:opacity-60 md:block"
              aria-label={`Wishlist${wishReady && wishCount ? `, ${wishCount} items` : ''}`}
            >
              <Heart className="size-[19px]" strokeWidth={1.25} />
              {wishReady && wishCount > 0 && <CountDot value={wishCount} />}
            </Link>

            <button
              type="button"
              onClick={() => open('cart')}
              className="relative p-2 transition-opacity duration-500 hover:opacity-60"
              aria-label={`Shopping bag${cartReady && cartCount ? `, ${cartCount} items` : ', empty'}`}
            >
              <ShoppingBag className="size-[19px]" strokeWidth={1.25} />
              {cartReady && cartCount > 0 && <CountDot value={cartCount} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function CountDot({ value }: { value: number }) {
  return (
    <span
      className="tnum absolute top-0 right-0 grid size-[17px] place-items-center rounded-full bg-wine-700 text-[9px] font-medium text-ivory-50"
      aria-hidden="true"
    >
      {value > 9 ? '9+' : value}
    </span>
  );
}
