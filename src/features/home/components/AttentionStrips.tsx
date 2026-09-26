import Image from 'next/image';
import Link from 'next/link';
import { editorialPhoto } from '@/config/media';
import { attention } from '@/features/home/content';

/**
 * "Worth your attention" — a row of narrow black-and-white strips; the one
 * under the pointer (or keyboard focus) widens and blooms into colour, and
 * the first one is open until the visitor points elsewhere. Pure CSS — see
 * .attention-strips in globals.css. On phones it is a two-column grid in
 * colour.
 */
export function AttentionStrips() {
  return (
    <section className="bg-ivory-50 pb-24">
      <div className="container-editorial">
        <p className="eyebrow text-ink-400">{attention.eyebrow}</p>
        <h2 className="display-lg mt-2 font-light text-ink-900">{attention.title}</h2>

        <ul className="attention-strips mt-10">
          {attention.items.map((item, i) => (
            <li key={item.label}>
              <Link href={item.href}>
                <Image
                  src={editorialPhoto(item.photo)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 40vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                <span className="absolute top-4 left-4 font-display text-sm text-ivory-50/80">
                  0{i + 1}
                </span>
                <span className="strip-label eyebrow absolute bottom-5 left-4 text-ivory-50">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
