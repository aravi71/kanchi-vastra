import { notFound } from 'next/navigation';

/**
 * Any URL no other route matches lands here, so it renders the store's own
 * not-found page — inside the store frame, with a real 404 status — instead
 * of the bare root fallback.
 */
export default function UnknownPage() {
  notFound();
}
