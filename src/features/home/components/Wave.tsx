import { cn } from '@/lib/utils';

/**
 * A soft wave edge between two sections. `fill` is the colour of the section
 * the wave belongs to; flip it to sit on the bottom edge.
 */
export function Wave({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('block h-8 w-full md:h-14', flip && 'rotate-180', className)}
    >
      <path
        d="M0 60V28c120 20 240 30 360 22s240-38 360-38 240 30 360 38 240-2 360-22v32H0Z"
        fill="currentColor"
      />
    </svg>
  );
}
