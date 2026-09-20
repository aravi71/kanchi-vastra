import type { Metadata } from 'next';
import { Heart, ShoppingBag, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Customer accounts for Sri Kanchi Silks.',
  robots: { index: false, follow: true },
};

/**
 * Accounts are not implemented. Rather than show a sign-in form that cannot
 * authenticate anyone, this page says so plainly and points at the two
 * features that do work without an account.
 */
export default function AccountPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Accounts are not open yet"
        description="We have not built customer accounts. Your bag and wishlist work without one — they are saved in this browser."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Account' }]}
      />

      <div className="container-editorial pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="border border-ivory-300 bg-ivory-200/40 p-8 md:p-10">
              <UserRound className="size-8 text-ivory-400" strokeWidth={0.9} />
              <h2 className="display-sm mt-5 font-light">What this will do later</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Once ordering is live, an account will hold your order history, saved addresses
                and a wishlist that follows you between devices. None of that exists today, and
                we would rather tell you than show you a sign-in box that does nothing.
              </p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Reveal delay={70}>
              <div className="h-full border border-ivory-300 p-7">
                <ShoppingBag className="size-5 text-gold-600" strokeWidth={1.2} />
                <h3 className="eyebrow-sm mt-4">Your bag</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                  Saved in this browser. It will still be here when you come back on this
                  device.
                </p>
                <ButtonLink href="/cart" variant="secondary" size="sm" className="mt-5">
                  View Bag
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={130}>
              <div className="h-full border border-ivory-300 p-7">
                <Heart className="size-5 text-gold-600" strokeWidth={1.2} />
                <h3 className="eyebrow-sm mt-4">Your wishlist</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                  Also saved in this browser. Useful when a weave is down to its last few
                  pieces.
                </p>
                <ButtonLink href="/wishlist" variant="secondary" size="sm" className="mt-5">
                  View Wishlist
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
