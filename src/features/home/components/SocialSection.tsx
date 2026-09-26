import Image from 'next/image';
import { AtSign } from 'lucide-react';
import { contact } from '@/config/site';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

const tiles = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/images/editorial/social-${n}.svg`,
  alt: 'Placeholder image from the Kanchi Vastra collection',
}));

/**
 * Social strip. No follower counts, no engagement figures, no fabricated
 * captions — just the collection and a link that becomes live once the
 * account exists.
 */
export function SocialSection() {
  const handleConfigured = Boolean(contact.social.instagram);

  return (
    <section className="bg-ivory-100 py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-wine-700">Follow</p>
          <h2 className="display-lg mt-5 text-balance font-light">
            Follow the world of Kanchi Vastra
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-600">
            New weaves, details from the loom, and the occasional look at how a saree comes
            together.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 md:mt-16">
        <ul className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 md:grid md:grid-cols-6 md:overflow-visible md:px-10 xl:px-16">
          {tiles.map((tile, i) => (
            <Reveal as="li" key={tile.src} delay={i * 55} className="w-[42vw] shrink-0 md:w-auto">
              <div className="group relative aspect-square overflow-hidden bg-ivory-200">
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 768px) 42vw, 16vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 grid place-items-center bg-wine-950/0 opacity-0 transition-all duration-500 group-hover:bg-wine-950/35 group-hover:opacity-100">
                  <AtSign className="size-6 text-ivory-50" strokeWidth={1.2} />
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="container-editorial mt-12 text-center">
        {handleConfigured ? (
          <ButtonLink
            href={contact.social.instagram}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AtSign className="size-4" strokeWidth={1.3} />
            Follow on Instagram
          </ButtonLink>
        ) : (
          <p className="eyebrow-sm text-ink-400">
            Instagram launching soon — the handle will appear here
          </p>
        )}
      </div>
    </section>
  );
}
