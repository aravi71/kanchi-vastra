import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

/**
 * The shop's section opening: a brass label between hairlines, a serif
 * title in capitals, a diamond rule and one soft italic line.
 */
export function SectionTitle({
  eyebrow,
  title,
  kicker,
  as: Tag = 'h2',
  className,
}: {
  eyebrow?: string;
  title: string;
  kicker?: string;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <Reveal className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <p className="label-brass flex items-center justify-center gap-4">
          <i className="h-px w-10 bg-brass-500/60" />
          {eyebrow}
          <i className="h-px w-10 bg-brass-500/60" />
        </p>
      )}
      <Tag className="title-caps mt-4 text-[clamp(1.75rem,4.4vw,3rem)] text-balance text-cream-50">
        {title}
      </Tag>
      <div className="divider-diamond mx-auto mt-5 w-44">
        <i />
      </div>
      {kicker && (
        <p className="italic-accent mt-5 text-[clamp(1.05rem,1.8vw,1.3rem)] text-cream-200/85">
          {kicker}
        </p>
      )}
    </Reveal>
  );
}
