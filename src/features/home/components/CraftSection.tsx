import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { PeacockCorner, SectionDivider } from '@/components/motifs/Motifs';

const pillars = [
  {
    index: '01',
    title: 'The Weave',
    body: 'Body and border are woven separately and joined thread by thread — the korvai technique that gives a Kanchipuram its characteristic crispness at the seam.',
    image: '/images/editorial/craft-loom.svg',
    alt: 'An emerald silk saree with a kolam lattice motif worked across the body',
  },
  {
    index: '02',
    title: 'The Zari',
    body: 'Zari is the metallic thread that carries the ornament. Its finish decides whether a saree reads as bright or antique, and it is the single largest factor in the weight of the cloth.',
    image: '/images/editorial/craft-zari.svg',
    alt: 'Close view of antique gold zari worked into a mango motif',
  },
  {
    index: '03',
    title: 'The Colour',
    body: 'Silk takes dye differently from every other fibre. We choose grounds for how they behave in daylight and under evening light, not for how they photograph in a studio.',
    image: '/images/editorial/craft-dye.svg',
    alt: 'A deep violet silk saree with concentric rudraksha motifs in gold',
  },
];

export function CraftSection() {
  return (
    <section
      id="craftsmanship"
      className="relative overflow-hidden bg-wine-950 py-24 text-ivory-200 md:py-32 lg:py-40"
    >
      <PeacockCorner className="absolute top-8 -left-16 hidden size-80 text-gold-500/[0.07] lg:block" />
      <PeacockCorner className="absolute -right-16 bottom-8 hidden size-80 rotate-180 text-gold-500/[0.07] lg:block" />

      <div className="container-editorial relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold-400/85">The Craft</p>
          <h2 className="display-xl mt-5 font-light text-balance text-ivory-50">
            Three things decide a silk saree
          </h2>
          <SectionDivider className="mx-auto mt-8 max-w-xs" />
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-20 lg:gap-12">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.index} delay={i * 110} y={26}>
              <article>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 31vw"
                    className="object-cover"
                  />
                  <span className="tnum absolute top-0 left-0 bg-wine-950/80 px-3.5 py-2 font-[family-name:var(--font-display)] text-sm text-gold-400">
                    {pillar.index}
                  </span>
                </div>
                <h3 className="display-sm mt-7 font-light text-ivory-50">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-[1.85] text-ivory-200/65">{pillar.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
