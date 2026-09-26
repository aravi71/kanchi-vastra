import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { editorialPhoto } from '@/config/media';
import { season } from '@/features/home/content';

/** A seasonal forecast: serif title, short note, three arched photographs. */
export function SeasonEdit() {
  return (
    <section className="bg-ivory-100 py-20 md:py-28">
      <div className="container-editorial grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center">
        <div>
          <p className="eyebrow text-ink-400">{season.eyebrow}</p>
          <h2 className="display-xl mt-3 font-light text-ink-900">
            {season.titleLines[0]}
            <br />
            <span className="text-crimson-600">{season.titleLines[1]}</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-500">{season.body}</p>
          <Link
            href={season.cta.href}
            className="eyebrow mt-8 inline-flex h-11 items-center rounded-full border border-ink-900/25 px-6 text-ink-900 transition-colors hover:bg-ink-900 hover:text-ivory-50"
          >
            {season.cta.label}
          </Link>
        </div>

        <ul className="grid grid-cols-3 items-end gap-3 md:gap-6">
          {season.photos.map((photo, i) => (
            <Reveal as="li" key={photo} delay={i * 120} className={i === 1 ? 'md:mb-12' : ''}>
              <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full">
                <Image
                  src={editorialPhoto(photo)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 32vw, 20vw"
                  className="object-cover"
                />
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
