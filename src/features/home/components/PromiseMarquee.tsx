import { marquee } from '@/features/home/content';

/**
 * A slow crimson band of shop promises. The list is rendered twice so the
 * -50% translate loops seamlessly; the copy is hidden from screen readers,
 * which get the list once.
 */
export function PromiseMarquee() {
  const items = [...marquee, ...marquee];

  return (
    <section aria-label="Our promises" className="overflow-hidden bg-crimson-700 text-ivory-50">
      <ul className="sr-only">
        {marquee.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="animate-marquee flex w-max items-center py-3.5">
        {items.map((item, i) => (
          <span key={i} className="flex items-center font-display text-lg italic">
            <span className="px-8 whitespace-nowrap">{item}</span>
            <span className="size-1 rounded-full bg-marigold-400" />
          </span>
        ))}
      </div>
    </section>
  );
}
