import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { KolamGround, LotusMark } from '@/components/motifs/Motifs';

export function HeritageStory() {
  return (
    <section className="relative overflow-hidden bg-ivory-100 py-24 md:py-32 lg:py-40">
      <KolamGround className="text-wine-900/[0.045]" />

      <div className="container-editorial relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* --- image stack --- */}
          <Reveal className="relative lg:col-span-6" y={28}>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/editorial/heritage.svg"
                alt="Detail of a crimson silk saree showing a stepped temple border woven in gold zari"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Offset detail frame — the editorial device used throughout the site. */}
            <div className="absolute -bottom-8 -right-4 hidden aspect-square w-44 overflow-hidden border-[6px] border-ivory-100 md:block lg:-right-10 lg:w-56">
              <Image
                src="/images/editorial/craft-zari.svg"
                alt="Close view of antique gold zari thread worked into a mango motif"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* --- copy --- */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="eyebrow text-wine-700">Woven with Heritage</p>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="display-xl mt-6 text-balance font-light">
                A tradition measured in threads, not years
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <LotusMark className="mt-8 text-gold-500" size={26} />
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-7 space-y-5 text-[0.9375rem] leading-[1.85] text-ink-600">
                <p>
                  Kanchi Vastra celebrates the timeless artistry of South Indian silk weaving
                  through a contemporary collection of elegant sarees.
                </p>
                <p>
                  The weaves we are drawn to are the ones that have changed least — the stepped
                  temple border, the korvai join worked by hand, the lotus and mango buttas that
                  have travelled across centuries of Indian textile. What we bring to them is
                  restraint: fewer motifs, cleaner grounds, and colour chosen for how it behaves
                  in real light rather than under a studio lamp.
                </p>
                <p>
                  We are at the beginning of this. As the collection grows, so will what we can
                  tell you about the hands behind each saree.
                </p>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <ButtonLink href="/about" variant="secondary" className="mt-10">
                Our Story
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
