import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { CraftSection } from '@/components/home/CraftSection';
import { KolamGround, LotusMark, SectionDivider } from '@/components/motifs/Motifs';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Kanchi Vastra celebrates the timeless artistry of South Indian silk weaving through a contemporary collection of elegant sarees.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Ancient craftsmanship, presented through modern luxury"
        description="Kanchi Vastra celebrates the timeless artistry of South Indian silk weaving through a contemporary collection of elegant sarees."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
        divider
      />

      {/* --- our story ------------------------------------------------- */}
      <section className="container-editorial pb-20 md:pb-28">
        <Reveal y={26}>
          <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
            <Image
              src="/images/editorial/about-story.svg"
              alt="A deep teal Kanchipuram silk saree with peacock plume motifs and a contrast border"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="display-lg font-light text-balance">Our Story</h2>
            <LotusMark className="mt-6 text-gold-500" size={24} />
          </Reveal>

          <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-5 text-[1.0625rem] leading-[1.9] text-ink-700">
              <p>
                Kanchi Vastra is a new house, built around a simple conviction: that the
                silk traditions of South India do not need reinventing, only presenting well.
              </p>
              <p>
                The sarees we are drawn to are the ones that have changed least across
                generations — the stepped temple border, the korvai join worked thread by
                thread, the lotus and mango buttas that have travelled through centuries of
                Indian textile. These are not decorative choices. They are a grammar, and it is
                a grammar worth keeping intact.
              </p>
              <p>
                What we bring to it is restraint. Fewer motifs. Cleaner grounds. Colour chosen
                for how it behaves in real light rather than under a studio lamp. A saree should
                be able to hold a room without shouting across it.
              </p>
              <p className="text-ink-500">
                We are at the very beginning of this. As the collection grows, so will what we
                are able to tell you about the hands behind each weave — and we would rather
                say nothing than say something we cannot yet stand behind.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- the art of silk ------------------------------------------- */}
      <section className="relative overflow-hidden border-y border-ivory-300 bg-ivory-200/60 py-20 md:py-28">
        <KolamGround className="text-wine-900/[0.04]" />
        <div className="container-editorial relative">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal y={26}>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/images/editorial/about-philosophy.svg"
                  alt="An ivory Kanchipuram silk saree with lotus buttas worked in deep gold zari"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="eyebrow text-wine-700">The Art of Silk</h2>
              <p className="display-md mt-6 font-light text-balance">
                Why silk behaves differently from everything else
              </p>
              <div className="mt-7 space-y-5 text-[0.9375rem] leading-[1.9] text-ink-600">
                <p>
                  Silk is a protein fibre with a triangular cross-section. That geometry is the
                  entire reason silk has its particular lustre: the fibre refracts light at
                  different angles along its length, so the same cloth reads as several depths
                  of one colour at once.
                </p>
                <p>
                  It also means silk takes dye unlike cotton or synthetic fibre. Colour sits
                  <em> in</em> the thread rather than on it, which is why a good silk ground has
                  depth and a poor one looks painted.
                </p>
                <p>
                  Weight comes from two places: the density of the weave and the quantity of
                  zari. A heavier saree holds its pleats longer and drapes with more authority.
                  A lighter one moves. Neither is better — they are different tools.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Kanchipuram heritage -------------------------------------- */}
      <section className="container-editorial py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="eyebrow text-wine-700">Kanchipuram Heritage</h2>
          <p className="display-lg mt-6 font-light text-balance">
            A town that has been weaving for a very long time
          </p>
          <SectionDivider className="mx-auto mt-9 max-w-xs" />
        </Reveal>

        <Reveal delay={90} className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-5 text-[1.0625rem] leading-[1.9] text-ink-700">
            <p>
              Kanchipuram, in Tamil Nadu, is one of the oldest continuously inhabited
              temple towns in India, and silk weaving there is old enough that its origins are
              recorded more in tradition than in documents.
            </p>
            <p>
              What distinguishes the Kanchipuram saree technically is the korvai construction:
              the body and the border are woven from separate warps and interlocked by hand
              where they meet. It is slower than weaving a saree in one piece, and it is what
              allows a border to be a genuinely different colour and weight from the body
              without the join weakening.
            </p>
            <p>
              The motifs are drawn largely from the architecture around the looms — the stepped
              profile of a gopuram, the rosettes and lotus medallions on temple ceilings, the
              rudraksha bead. Textile and stone borrowing from one another for centuries.
            </p>
            <p className="text-ink-500">
              We use &ldquo;Kanchipuram-inspired&rdquo; deliberately. Geographical-indication
              certification for genuine Kanchipuram silk is a formal process, and we will make
              specific origin claims only once we can document them.
            </p>
          </div>
        </Reveal>
      </section>

      {/* --- craftsmanship (shared with the homepage) ------------------ */}
      <CraftSection />

      {/* --- philosophy ------------------------------------------------ */}
      <section className="container-editorial py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="display-lg font-light text-balance">Our Philosophy</h2>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
            <ol className="space-y-9">
              {[
                {
                  n: '01',
                  t: 'Fewer, better',
                  b: 'A small collection, edited hard. We would rather show twenty sarees we can speak about in detail than two hundred we cannot.',
                },
                {
                  n: '02',
                  t: 'Say only what is true',
                  b: 'No invented lineage, no borrowed heritage, no claims about weavers or certifications we have not verified. Where we do not yet know, we say so.',
                },
                {
                  n: '03',
                  t: 'The weave leads',
                  b: 'Presentation exists to serve the cloth. If a photograph, a page or a price is doing more work than the saree, something has gone wrong.',
                },
              ].map((item) => (
                <li key={item.n} className="flex gap-6 border-b border-ivory-300 pb-9 last:border-0">
                  <span className="font-[family-name:var(--font-display)] text-2xl tnum text-gold-600">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="display-sm font-light">{item.t}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-[1.85] text-ink-600">{item.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* --- close ----------------------------------------------------- */}
      <section className="border-t border-ivory-300 bg-ivory-200/50 py-20 text-center md:py-24">
        <div className="container-editorial">
          <Reveal>
            <h2 className="display-md font-light text-balance">See what is on the loom</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/shop">Explore the Collection</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Get in Touch
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
