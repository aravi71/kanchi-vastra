import { BadgeCheck, Headset, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { trustPoints } from '@/config/site';
import { Reveal } from '@/components/ui/Reveal';

const icons = {
  sparkles: Sparkles,
  'badge-check': BadgeCheck,
  shield: ShieldCheck,
  truck: Truck,
  headset: Headset,
} as const;

/**
 * Trust signals limited to statements the business can actually stand behind.
 * No customer counts, no awards, no certifications, no invented rankings.
 */
export function TrustSection() {
  return (
    <section className="border-y border-ivory-300 bg-ivory-200/50 py-16 md:py-20">
      <div className="container-editorial">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {trustPoints.map((point, i) => {
            const Icon = icons[point.icon];
            return (
              <Reveal as="li" key={point.title} delay={i * 60}>
                <Icon className="size-5 text-gold-600" strokeWidth={1.2} />
                <h3 className="eyebrow-sm mt-4 text-ink-900">{point.title}</h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-500">{point.body}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
