import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionDivider } from '@/components/motifs/Motifs';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Standard opening block for interior pages. Interior pages sit below a solid
 * header, so the top padding here accounts for its height.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  align = 'left',
  divider = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  align?: 'left' | 'center';
  divider?: boolean;
  className?: string;
}) {
  const centered = align === 'center';

  return (
    <div className={cn('container-editorial pb-10 pt-32 md:pb-14 md:pt-44', className)}>
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className={cn('mb-7', centered && 'flex justify-center')}>
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
            {crumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3 text-ink-300" strokeWidth={1.5} />}
                {crumb.href ? (
                  <Link href={crumb.href} className="link-underline hover:text-ink-700">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink-600">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className={cn(centered && 'mx-auto max-w-2xl text-center')}>
        {eyebrow && (
          <Reveal>
            <p className="eyebrow text-wine-700">{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={60}>
          <h1 className={cn('display-xl font-light text-balance', eyebrow && 'mt-5')}>{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={120}>
            <p
              className={cn(
                'mt-6 text-[0.9375rem] leading-[1.85] text-ink-600',
                centered ? 'mx-auto max-w-xl' : 'max-w-2xl',
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
        {divider && <SectionDivider className={cn('mt-9', centered && 'mx-auto max-w-xs')} />}
      </div>
    </div>
  );
}
