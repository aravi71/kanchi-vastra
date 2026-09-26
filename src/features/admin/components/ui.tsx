import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Small building blocks shared by the admin pages. */

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-light md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-lg border border-ivory-300 bg-white p-5 md:p-6', className)}>
      {title && <h2 className="eyebrow-sm mb-4 text-ink-500">{title}</h2>}
      {children}
    </section>
  );
}

const tones = {
  ACTIVE: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  DRAFT: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  ARCHIVED: 'bg-stone-100 text-stone-600 ring-stone-500/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  neutral: 'bg-stone-100 text-stone-700 ring-stone-500/20',
} as const;

export function Badge({ tone, children }: { tone: keyof typeof tones; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export const statusLabel: Record<string, string> = {
  ACTIVE: 'On sale',
  DRAFT: 'Draft (hidden)',
  ARCHIVED: 'Archived (hidden)',
};
