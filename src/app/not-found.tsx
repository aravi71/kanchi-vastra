import Link from 'next/link';

/**
 * Last-resort 404 for anything outside the storefront route group. Store URLs
 * are handled by (store)/[...unknown] and (store)/not-found.tsx. Kept minimal
 * on purpose: Next embeds this component in every page's payload.
 */
export default function RootNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-wine-950 text-ivory-100">
      <p className="eyebrow text-gold-400">Error 404</p>
      <h1 className="font-display text-4xl font-light">Page not found</h1>
      <Link href="/" className="underline underline-offset-4">
        Return to Kanchi Vastra
      </Link>
    </main>
  );
}
