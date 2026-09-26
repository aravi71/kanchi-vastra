import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { editorialPhoto } from '@/config/media';
import { occasions } from '@/features/home/content';

/** "EDITS FOR every occasion" — four tall captioned photographs. */
export function OccasionEdits() {
  return (
    <section className="bg-ivory-50 py-20 md:py-28">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="flex flex-wrap items-baseline gap-x-4">
            <span className="display-condensed text-[clamp(2.75rem,6vw,5rem)] text-ink-900">
              {occasions.title}
            </span>
            <span className="script-accent text-[clamp(2.25rem,4.5vw,4rem)]">
              {occasions.accent}
            </span>
          </h2>
          <Link href={occasions.cta.href} className="eyebrow link-underline pb-2 text-ink-700">
            {occasions.cta.label}
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {occasions.items.map((edit, i) => (
            <Reveal as="li" key={edit.label} delay={i * 90}>
              <Link
                href={edit.href}
                className="group relative block aspect-[3/4.4] overflow-hidden"
              >
                <Image
                  src={editorialPhoto(edit.photo)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="eyebrow-sm block text-marigold-300">{edit.note}</span>
                  <span className="mt-1 block font-display text-2xl leading-tight text-ivory-50 md:text-3xl">
                    {edit.label}
                  </span>
                  <span className="eyebrow-sm mt-3 inline-block text-ivory-100/80 transition-colors group-hover:text-marigold-300">
                    Explore →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
