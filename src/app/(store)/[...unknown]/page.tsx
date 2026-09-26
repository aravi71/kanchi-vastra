import { notFound } from 'next/navigation';

/**
 * Any URL no other route matches lands here, so it renders the store's own
 * not-found page — inside the store frame — instead of the bare root
 * fallback.
 *
 * force-dynamic is essential: under the store's ISR defaults Next would
 * cache the not-found render and serve it with status 200 (a soft 404).
 */
export const dynamic = 'force-dynamic';

export default function UnknownPage() {
  notFound();
}
