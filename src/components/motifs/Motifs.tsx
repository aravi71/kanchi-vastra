import { cn } from '@/lib/utils';

/* ===========================================================================
   VISUAL LANGUAGE
   Original ornament drawn from temple borders, kolam lattice, lotus and
   peacock line-work. Used sparingly — as dividers, corners and grounds —
   so the pages stay quiet.
   =========================================================================== */

/** A stepped temple-spire border. Repeats horizontally, scales to any width. */
export function TempleBorder({
  className,
  flip = false,
  height = 14,
}: {
  className?: string;
  flip?: boolean;
  height?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn('block w-full', className)}
      height={height}
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <defs>
        <pattern id="kv-temple" width="20" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 14V9h3.5V4.5H7V0h6v4.5h3.5V9H20v5z"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="120" height="14" fill="url(#kv-temple)" />
    </svg>
  );
}

/** Lotus rosette — used as a section mark between headings and copy. */
export function LotusMark({ className, size = 22 }: { className?: string; size?: number }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg
      aria-hidden="true"
      className={cn('shrink-0', className)}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="currentColor"
    >
      {petals.map((deg) => (
        <ellipse key={deg} cx="20" cy="10.5" rx="3.4" ry="9.5" transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3.1" />
    </svg>
  );
}

/**
 * A hairline rule interrupted by a lotus mark. The house divider.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-5', className)} aria-hidden="true">
      <span className="rule-gold flex-1" />
      <LotusMark className="text-gold-500/70" size={18} />
      <span className="rule-gold flex-1" />
    </div>
  );
}

/** Kolam lattice, used as a faint ground behind editorial sections. */
export function KolamGround({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <defs>
        <pattern id="kv-kolam" width="64" height="64" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="32" cy="32" r="1.6" fill="currentColor" stroke="none" />
            <path d="M32 24c9 0 9 16 0 16s-9-16 0-16z" />
            <path d="M24 32c0-9 16-9 16 0s-16 9-16 0z" />
            <circle cx="0" cy="0" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="64" cy="64" r="1.6" fill="currentColor" stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kv-kolam)" />
    </svg>
  );
}

/** Peacock plume line-work, used as a large decorative corner. */
export function PeacockCorner({ className }: { className?: string }) {
  const arcs = [-2, -1, 0, 1, 2];
  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {arcs.map((i) => {
        const a = ((i * 17 - 90) * Math.PI) / 180;
        const ex = 100 + Math.cos(a) * 88;
        const ey = 176 + Math.sin(a) * 88;
        return (
          <g key={i}>
            <path d={`M100 180 Q${100 + Math.cos(a) * 44 - i * 10} ${176 + Math.sin(a) * 44} ${ex} ${ey}`} />
            <circle cx={ex} cy={ey} r="9" />
            <circle cx={ex} cy={ey} r="3.4" fill="currentColor" stroke="none" />
          </g>
        );
      })}
    </svg>
  );
}

/** Small diamond used to punctuate letterspaced labels. */
export function Diamond({ className, size = 5 }: { className?: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block rotate-45 bg-current align-middle', className)}
      style={{ width: size, height: size }}
    />
  );
}
