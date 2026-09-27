'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import { navigation } from '@/config/site';
import { useCart } from '@/features/cart/cart-store';
import { useWishlist } from '@/features/wishlist/wishlist-store';
import { useUi } from '@/components/layout/ui-state';
import { Medallion } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

/** Pages that open on a full-bleed photograph the header floats over. */
const TRANSPARENT_ROUTES = ['/'];

/* Desktop: navigation either side of the centred medallion. */
const LEFT = navigation.slice(0, 4);
const RIGHT = navigation.slice(4);

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

  const navLink = (item: (typeof navigation)[number]) => {
    const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
    return (
      <li key={item.href} className={cn(item.href === '/' && 'hidden xl:block')}>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'text-[0.6875rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-500',
            active ? 'text-brass-300' : 'text-cream-100/80 hover:text-brass-300',
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 text-cream-100 transition-[background-color,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        overHero
          ? 'border-b border-transparent bg-gradient-to-b from-forest-950/70 to-transparent'
          : 'border-b border-brass-500/20 bg-forest-900/92 backdrop-blur-md',
      )}
    >
      <div className="container-editorial">
        <div className="relative flex h-[76px] items-center justify-between md:h-[92px]">
          {/* --- mobile: menu --- */}
          <button
            type="button"
            onClick={() => open('menu')}
            className="-ml-1 flex h-10 w-10 flex-col justify-center gap-[7px] lg:hidden"
            aria-label="Open menu"
          >
            <span className="block h-px w-7 bg-current" />
            <span className="block h-px w-7 bg-current" />
          </button>

          {/* --- desktop: left navigation --- */}
          <nav aria-label="Primary" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-6 xl:gap-9">{LEFT.map(navLink)}</ul>
          </nav>

          {/* --- medallion --- */}
          <Link
            href="/"
            aria-label="Kanchi Vastra — home"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:px-8"
          >
            <Medallion size={40} className="md:hidden" />
            <Medallion size={46} className="hidden md:inline-flex" />
          </Link>

          {/* --- desktop: right navigation + actions --- */}
          <div className="flex flex-1 items-center justify-end gap-6 xl:gap-9">
            <nav aria-label="More" className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-9">{RIGHT.map(navLink)}</ul>
            </nav>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                type="button"
                onClick={() => open('search')}
                className="p-2 transition-colors duration-500 hover:text-brass-300"
                aria-label="Search"
              >
                <Search className="size-[20px]" strokeWidth={1.25} />
              </button>
              <Link
                href="/account"
                className="hidden p-2 transition-colors duration-500 hover:text-brass-300 md:block"
                aria-label="Account"
              >
                <User className="size-[20px]" strokeWidth={1.25} />
              </Link>
              <Link
                href="/wishlist"
                className="relative hidden p-2 transition-colors duration-500 hover:text-brass-300 md:block"
                aria-label={`Wishlist${wishReady && wishCount ? `, ${wishCount} items` : ''}`}
              >
                <Heart className="size-[20px]" strokeWidth={1.25} />
                {wishReady && wishCount > 0 && <CountDot value={wishCount} />}
              </Link>
              <button
                type="button"
                onClick={() => open('cart')}
                className="relative p-2 transition-colors duration-500 hover:text-brass-300"
                aria-label={`Shopping bag${cartReady && cartCount ? `, ${cartCount} items` : ', empty'}`}
              >
                <ShoppingBag className="size-[20px]" strokeWidth={1.25} />
                {cartReady && cartCount > 0 && <CountDot value={cartCount} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function CountDot({ value }: { value: number }) {
  return (
    <span
      className="tnum absolute top-0.5 right-0 grid size-[17px] place-items-center rounded-full bg-brass-500 text-[9px] font-semibold text-forest-900"
      aria-hidden="true"
    >
      {value > 9 ? '9+' : value}
    </span>
  );
}
