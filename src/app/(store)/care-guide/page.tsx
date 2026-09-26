import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { SectionDivider } from '@/components/motifs/Motifs';

export const metadata: Metadata = {
  title: 'Care Guide',
  description:
    'How to wash, store, fold and handle silk sarees and zari so they last a generation.',
  alternates: { canonical: '/care-guide' },
};

const sections = [
  {
    n: '01',
    title: 'Cleaning',
    body: [
      'Pure silk sarees with zari should be dry cleaned only. Water swells the protein fibre and detergent strips the finish; both dull the lustre permanently. Zari is metallic thread, and it tarnishes.',
      'Silk-cotton weaves are more tolerant. A gentle hand wash in cold water with a mild, pH-neutral soap is acceptable — separately, never with other colours, and never wrung.',
      'Treat a stain quickly but gently. Blot, do not rub. Take it to a dry cleaner who handles silk specifically, and tell them what caused the stain.',
    ],
  },
  {
    n: '02',
    title: 'Drying',
    body: [
      'Never wring a silk saree. Press the water out between two dry cotton towels instead.',
      'Dry flat or on a padded hanger, in shade. Direct sunlight fades dyed silk faster than almost anything else, and it does so unevenly.',
    ],
  },
  {
    n: '03',
    title: 'Pressing',
    body: [
      'Use a cool iron, on the reverse of the fabric, with a thin cotton cloth between the iron and the silk. Never iron directly over zari — the heat flattens and discolours the metallic thread.',
      'Steaming from a short distance is safer than ironing, particularly for organza and tissue weaves.',
    ],
  },
  {
    n: '04',
    title: 'Storage',
    body: [
      'Fold the saree and wrap it in unbleached cotton muslin. Muslin lets the fibre breathe; plastic traps moisture and encourages mildew.',
      'Refold along a different line every three to four months. A fold left in place for years will eventually crack the zari along that line, and that damage cannot be undone.',
      'Keep sarees away from damp, from direct light, and from naphthalene balls in direct contact with the cloth. If you use them, keep them in a separate cloth pouch.',
    ],
  },
  {
    n: '05',
    title: 'Wearing',
    body: [
      'Apply perfume, deodorant and cosmetics before draping, and let them dry. Alcohol-based sprays stain silk and corrode zari.',
      'Take care with jewellery that has rough settings or open claws — zari snags easily, and a pulled thread on a border shows.',
      'Air the saree for a few hours after wearing, before folding it away. Putting silk straight back into storage while it still holds body moisture is the most common cause of avoidable damage.',
    ],
  },
];

export default function CareGuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Caring for silk"
        description="A silk saree with zari is a long-term object. Treated properly it outlives the person who bought it; treated carelessly it can be ruined in a single wash."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Care Guide' }]}
      />

      <div className="container-editorial pb-24 md:pb-32">
        <Reveal y={26}>
          <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
            <Image
              src="/images/editorial/craft-zari.svg"
              alt="Close view of antique gold zari worked into a mango motif on silk"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mx-auto mt-16 max-w-3xl">
          <ol className="space-y-12">
            {sections.map((section, i) => (
              <Reveal as="li" key={section.n} delay={i * 60}>
                <div className="flex gap-6 md:gap-9">
                  <span className="tnum font-[family-name:var(--font-display)] text-2xl text-gold-600">
                    {section.n}
                  </span>
                  <div className="flex-1">
                    <h2 className="display-sm font-light">{section.title}</h2>
                    <div className="mt-4 space-y-3.5 text-[0.9375rem] leading-[1.9] text-ink-600">
                      {section.body.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <SectionDivider className="my-14" />

          <Reveal>
            <div className="border border-ivory-300 bg-ivory-200/40 p-7">
              <h2 className="eyebrow">In short</h2>
              <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-ink-600">
                {[
                  'Dry clean pure silk. Hand wash silk-cotton, cold, alone.',
                  'Never iron directly on zari.',
                  'Store folded in cotton muslin, never plastic.',
                  'Refold every few months.',
                  'Perfume first, saree second.',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      className="mt-2 size-1 shrink-0 rotate-45 bg-gold-600"
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
