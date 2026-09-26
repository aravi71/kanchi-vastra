import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * The admin area: outside the (store) group, so no shop header, footer,
 * cart or catalogue payload. Never indexed.
 */
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Kanchi Vastra admin' },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-svh bg-[#f4f1ec] text-ink-900">{children}</div>;
}
