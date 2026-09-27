import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { editorialPhoto } from '@/config/media';
import { hero } from '@/features/home/content';

/**
 * Opening frame: one photograph, graded into the green; the headline in serif on the
 * left, one italic line and two buttons.
 */
export function HeroEmerald() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest-950 text-cream-100 md:items-center">
      {/* Phone: the photograph fills the top of the screen, the words sit on the
          green below. Desktop: it sits on the right and fades into the green,
          leaving the left for the words. */}
      <div className="absolute top-0 -right-[12.5%] -z-20 h-[80svh] w-[125%] md:inset-y-0 md:right-0 md:h-auto md:w-[64%]">
        <Image
          src={editorialPhoto(hero.photo)}
          alt={hero.photoAlt}
          fill
          priority
          sizes="(max-width: 768px) 125vw, 64vw"
          className="animate-kenburns object-cover object-[50%_100%] md:object-[50%_42%]"
        />
        {/* A light green grade so the photograph belongs to the page. */}
        <div className="absolute inset-0 bg-forest-800/10 mix-blend-multiply" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 from-[34%] via-forest-950/45 via-[52%] to-forest-950/10 to-[80%] md:bg-gradient-to-r md:from-forest-950 md:from-[36%] md:via-forest-950/60 md:via-[55%] md:to-forest-950/5 md:to-100%" />
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-40 bg-gradient-to-t from-forest-950/80 to-transparent md:block" />

      <div className="container-editorial w-full pt-32 pb-16 md:pb-0">
        <div className="max-w-xl">
          <p className="label-brass animate-fade-up flex items-center gap-4">
            {hero.eyebrow}
            <i className="h-px w-14 bg-brass-500/70" />
          </p>
          <h1
            className="animate-fade-up mt-6 font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6rem)] leading-[1.02] text-cream-50"
            style={{ animationDelay: '120ms' }}
          >
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p
            className="italic-accent animate-fade-up mt-5 text-[clamp(1.35rem,2.4vw,1.85rem)] text-cream-200"
            style={{ animationDelay: '240ms' }}
          >
            {hero.kicker}
          </p>
          <div
            className="animate-fade-up mt-10 flex max-w-sm flex-col gap-4"
            style={{ animationDelay: '360ms' }}
          >
            <Link href={hero.primary.href} className="btn-brass">
              {hero.primary.label}
              <ArrowRight className="size-4" strokeWidth={1.4} />
            </Link>
            <Link href={hero.secondary.href} className="btn-line">
              {hero.secondary.label}
              <ArrowRight className="size-4" strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
