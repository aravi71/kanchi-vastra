import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { LotusMark, TempleBorder } from '@/components/motifs/Motifs';
import { footerNav } from '@/config/site';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden bg-wine-950 px-5 py-32 text-center text-ivory-200">
      <TempleBorder className="absolute inset-x-0 top-0 rotate-180 text-gold-600/20" height={14} />

      <LotusMark className="text-gold-500/70" size={34} />

      <p className="eyebrow mt-9 text-gold-400/85">Error 404</p>

      <h1 className="display-xl mt-5 max-w-2xl font-light text-balance text-ivory-50">
        This thread leads nowhere
      </h1>

      <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ivory-200/70">
        The page you are looking for has been moved, or never existed. The collection, however, is
        exactly where you left it.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink
          href="/shop"
          variant="onDark"
          size="lg"
          className="border-transparent bg-ivory-50 text-wine-950 hover:bg-gold-400 hover:text-wine-950"
        >
          Explore the Collection
        </ButtonLink>
        <ButtonLink href="/" variant="onDark" size="lg">
          Return Home
        </ButtonLink>
      </div>

      <nav aria-label="Helpful links" className="mt-14">
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {[...footerNav.about, ...footerNav.help.slice(2)].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="eyebrow-sm link-underline text-ivory-200/60 transition-colors hover:text-ivory-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <TempleBorder className="absolute inset-x-0 bottom-0 text-gold-600/20" height={14} />
    </div>
  );
}
