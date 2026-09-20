import { cn } from '@/lib/utils';

/**
 * The gopuram monogram: a stepped temple silhouette whose interior courses
 * read as zari lines across a weave, capped by a kalasam finial.
 *
 * Rendered inline rather than as an <img> so it can inherit colour from its
 * container and stay crisp at every size. The standalone files in
 * /public/logo carry the same artwork for print and packaging.
 */
export function Monogram({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      className={cn('shrink-0', className)}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Kanchi Vastra"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 104 L46 30 C46 16 52 8 60 8 C68 8 74 16 74 30 L100 104" />
        <path d="M13 104 H107" />
        <path d="M26.3 86 H93.7" opacity=".72" />
        <path d="M32.7 68 H87.3" opacity=".58" />
        <path d="M39 50 H81" opacity=".44" />
        <path d="M45.3 32 H74.7" opacity=".3" />
      </g>
      <path d="M60 1.5C63.4 5.2 63.4 8.6 60 11.4C56.6 8.6 56.6 5.2 60 1.5Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Full lockup. The wordmark is live text rather than outlines so it stays
 * selectable, searchable and sharp at any zoom.
 */
export function Logo({
  className,
  orientation = 'horizontal',
  markClassName,
}: {
  className?: string;
  orientation?: 'horizontal' | 'stacked';
  markClassName?: string;
}) {
  const stacked = orientation === 'stacked';
  return (
    <span
      className={cn(
        'inline-flex select-none',
        stacked ? 'flex-col items-center gap-3' : 'items-center gap-3',
        className,
      )}
    >
      <Monogram className={cn('text-gold-500', markClassName)} size={stacked ? 52 : 32} />
      <span className={cn('flex flex-col', stacked ? 'items-center' : 'items-start')}>
        <span
          className="font-[family-name:var(--font-display)] leading-none"
          style={{ fontSize: stacked ? '1.75rem' : '1.1875rem', letterSpacing: '0.13em' }}
        >
          KANCHI
        </span>
        <span
          className="eyebrow-sm mt-1 leading-none opacity-70"
          style={{ letterSpacing: stacked ? '0.62em' : '0.46em' }}
        >
          <span className="relative left-[0.3em]">VASTRA</span>
        </span>
      </span>
    </span>
  );
}
