import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { editorialPhoto } from '@/config/media';
import { Reveal } from '@/components/ui/Reveal';
import { occasions } from '@/features/home/content';

/** The four edits as framed panels: photo, capitals, italic note, Explore. */
export function OccasionFrames() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
      {occasions.items.map((item, i) => (
        <Reveal as="li" key={item.href} delay={i * 80}>
          <Link
            href={item.href}
            className="group frame-brass relative isolate flex aspect-[4/3.4] items-end overflow-hidden rounded-[3px] bg-forest-800 p-6 md:aspect-[4/3] md:p-9"
          >
            <Image
              src={editorialPhoto(item.photo)}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="-z-20 object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/45 to-transparent" />
            <div>
              <h3 className="title-caps text-[clamp(1.6rem,3vw,2.4rem)] text-cream-50">
                {item.label}
              </h3>
              <i className="mt-4 block h-px w-10 bg-brass-500" />
              <p className="italic-accent mt-3 text-lg text-cream-200">{item.note}</p>
              <span className="mt-6 inline-flex items-center gap-4 border border-cream-100/45 px-5 py-3 text-[0.6875rem] font-medium tracking-[0.24em] text-cream-100 uppercase transition-colors duration-500 group-hover:border-brass-400 group-hover:text-brass-300">
                Explore
                <ArrowRight className="size-3.5" strokeWidth={1.4} />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
