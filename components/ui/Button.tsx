import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'onDark';
type Size = 'sm' | 'md' | 'lg';

/**
 * Rectangular, letterspaced, deliberately un-rounded. The luxury read comes
 * from the type and the slow transition, not from shadow or radius.
 */
const base =
  'relative inline-flex items-center justify-center gap-2.5 eyebrow whitespace-nowrap ' +
  'transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'disabled:pointer-events-none disabled:opacity-40';

const variants: Record<Variant, string> = {
  primary: 'bg-wine-800 text-ivory-50 hover:bg-wine-950',
  secondary: 'border border-ink-900/25 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-ivory-50',
  ghost: 'text-ink-900 hover:text-wine-700',
  gold: 'border border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-wine-950',
  onDark: 'border border-ivory-100/40 text-ivory-100 hover:bg-ivory-100 hover:text-wine-950',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.625rem]',
  md: 'h-12 px-7',
  lg: 'h-14 px-9',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & ComponentProps<'button'>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
