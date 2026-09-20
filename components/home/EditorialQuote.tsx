import { Reveal } from '@/components/ui/Reveal';
import { LotusMark, TempleBorder } from '@/components/motifs/Motifs';

/**
 * A quiet full-width pause between two dense sections. The line is the
 * brand's own statement of intent, not a fabricated quotation attributed to
 * a person or publication.
 */
export function EditorialQuote() {
  return (
    <section className="relative overflow-hidden bg-ivory-200/70 silk-weave">
      <TempleBorder className="text-ivory-100" height={12} flip />

      <div className="container-editorial py-24 md:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <LotusMark className="mx-auto text-gold-500" size={28} />
          <blockquote className="display-lg mt-8 text-balance font-light leading-[1.22]">
            Ancient craftsmanship, presented through modern luxury — nothing added to the weave,
            everything removed from around it.
          </blockquote>
          <p className="eyebrow-sm mt-8 text-ink-400">The Kanchi Vastra approach</p>
        </Reveal>
      </div>

      <TempleBorder className="text-ivory-100" height={12} />
    </section>
  );
}
