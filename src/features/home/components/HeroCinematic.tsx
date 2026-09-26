import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { editorialPhoto } from '@/config/media';
import { hero } from '@/features/home/content';

/**
 * Full-bleed opening frame: one photograph with a slow push-in, a large serif
 * headline, a marigold pill and a strip of promises along the bottom edge.
 */
export function HeroCinematic() {
  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-crimson-900 text-ivory-50">
      <Image
        src={editorialPhoto(hero.photo)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-kenburns -z-20 object-cover object-[60%_center]"
      />
      {/* Legibility: dark from the left and from the bottom, photo stays warm. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-crimson-900/85 via-crimson-900/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-crimson-900/90 to-transparent" />

      <div className="container-editorial w-full pt-40 pb-10 md:pb-14">
        <p className="eyebrow animate-fade-up text-marigold-300">{hero.eyebrow}</p>
        <h1 className="display-hero animate-fade-up mt-5 max-w-3xl font-light text-ivory-50 [animation-delay:120ms]">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="animate-fade-up mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ivory-100/80 [animation-delay:240ms]">
          {hero.body}
        </p>

        <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-6 [animation-delay:360ms]">
          <Link
            href={hero.primary.href}
            className="eyebrow group inline-flex h-13 items-center gap-3 rounded-full bg-marigold-400 pr-2 pl-7 text-crimson-900 transition-colors duration-500 hover:bg-marigold-300"
          >
            {hero.primary.label}
            <span className="grid size-9 place-items-center rounded-full bg-crimson-900 text-marigold-300 transition-transform duration-500 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" strokeWidth={1.6} />
            </span>
          </Link>
          <Link
            href={hero.secondary.href}
            className="eyebrow group inline-flex items-center gap-3 text-ivory-50"
          >
            <span className="grid size-12 place-items-center rounded-full border border-ivory-50/40 transition-colors duration-500 group-hover:bg-ivory-50 group-hover:text-crimson-900">
              <Play className="size-4 translate-x-px" strokeWidth={1.6} />
            </span>
            {hero.secondary.label}
          </Link>
        </div>

        <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-ivory-50/15 pt-6 text-xs text-ivory-100/75">
          {hero.promises.map((promise) => (
            <li key={promise} className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-marigold-400" aria-hidden="true" />
              {promise}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
