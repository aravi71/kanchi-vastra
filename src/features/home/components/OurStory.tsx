import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { editorialPhoto } from '@/config/media';
import { Reveal } from '@/components/ui/Reveal';
import { closing, story } from '@/features/home/content';

/**
 * The brand story: a photograph set in an offset brass frame, the story
 * beside it, then a quiet closing line with a thread falling from it.
 */
export function OurStory() {
  return (
    <>
      <section className="container-editorial grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mr-4 mb-4 md:mr-6 md:mb-6">
          <div className="absolute inset-0 translate-x-4 translate-y-4 border border-brass-500/60 md:translate-x-6 md:translate-y-6" />
          <div className="relative aspect-[4/5] overflow-hidden bg-forest-800">
            <Image
              src={editorialPhoto(story.photo)}
              alt="A bride in silk on the morning of her wedding"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="label-brass">{story.eyebrow}</p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] text-cream-50">
            {story.title}
            <span className="italic-accent block text-brass-300">{story.accent}</span>
          </h2>
          <i className="mt-7 block h-px w-16 bg-brass-500" />
          <p className="mt-7 max-w-md text-[0.95rem] leading-[1.9] text-cream-200/85">
            {story.body}
          </p>
          <p className="italic-accent mt-5 max-w-md text-lg leading-relaxed text-cream-200/75">
            {story.note}
          </p>
          <Link href={story.cta.href} className="btn-line mt-10">
            {story.cta.label}
            <ArrowRight className="size-4" strokeWidth={1.4} />
          </Link>
        </Reveal>
      </section>

      <Reveal className="container-editorial pb-24 text-center md:pb-32">
        <p className="text-[0.8125rem] font-medium tracking-[0.34em] text-cream-100 uppercase">
          {closing.lines[0]}
        </p>
        <p className="mt-2 text-[0.6875rem] tracking-[0.34em] text-brass-300 uppercase">
          {closing.lines[1]}
        </p>
        <i className="mx-auto mt-8 block h-16 w-px bg-gradient-to-b from-brass-400 to-transparent" />
        <p className="mt-6 font-[family-name:var(--font-display)] text-lg text-cream-200/85">
          {closing.body}
        </p>
      </Reveal>
    </>
  );
}
