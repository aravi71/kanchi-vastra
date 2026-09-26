import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { editorialPhoto } from '@/config/media';
import { moods } from '@/features/home/content';

/** "SIX MOODS." — a loud condensed title over six temple-arch portraits. */
export function MoodArches() {
  return (
    <section className="bg-ivory-50 py-20 md:py-28">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display-condensed text-[clamp(3rem,8vw,6.5rem)] text-ink-900">
            {moods.title}
          </h2>
          <p className="eyebrow pb-3 text-ink-400">{moods.kicker}</p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {moods.items.map((mood, i) => (
            <Reveal as="li" key={mood.label} delay={i * 70}>
              <Link href={mood.href} className="group block text-center">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full border border-gold-400/40 bg-ivory-200 p-1.5">
                  <span className="relative block h-full w-full overflow-hidden rounded-t-full">
                    <Image
                      src={editorialPhoto(mood.photo)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                  </span>
                </span>
                <span className="eyebrow mt-4 block text-ink-700 transition-colors group-hover:text-crimson-600">
                  {mood.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
