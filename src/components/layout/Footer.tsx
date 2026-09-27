import Link from 'next/link';
import { ArrowUp, AtSign, Mail, MessageCircle } from 'lucide-react';
import { contact, footerNav, site } from '@/config/site';
import { Medallion } from '@/components/ui/Logo';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

const columns = [
  { title: 'Shop', links: footerNav.shop },
  { title: 'About', links: footerNav.about },
  { title: 'Help', links: footerNav.help },
];

export function Footer() {
  return (
    <footer className="relative border-t border-brass-500/25 bg-forest-950 text-cream-200">
      <div className="container-editorial">
        {/* --- medallion + newsletter ------------------------------------- */}
        <div className="grid gap-12 py-16 md:grid-cols-2 md:gap-16 lg:py-20">
          <div>
            <Medallion size={64} className="items-start" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-200/70">
              {site.positioning}
            </p>
            <p className="mt-5 font-[family-name:var(--font-script)] text-[2.1rem] leading-none text-brass-300">
              silks woven for the days you remember
            </p>
          </div>
          <div>
            <p className="label-brass">Stay in touch</p>
            <i className="mt-3 block h-px w-10 bg-brass-500" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream-200/75">
              Occasional notes on new arrivals and the craft behind them. No noise.
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="divider-diamond">
          <i />
        </div>

        {/* --- navigation ------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4 lg:py-16">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="label-brass">{col.title}</h3>
              <i className="mt-3 block h-px w-8 bg-brass-500/70" />
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-[family-name:var(--font-display)] text-[0.95rem] text-cream-200/85 transition-colors duration-500 hover:text-brass-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="label-brass">Connect</h3>
            <i className="mt-3 block h-px w-8 bg-brass-500/70" />
            <ul className="mt-5 flex flex-wrap gap-3">
              <li>
                <ConnectLink
                  href={contact.social.instagram}
                  icon={<AtSign className="size-4" strokeWidth={1.3} />}
                  label="Instagram"
                />
              </li>
              <li>
                <ConnectLink
                  href={
                    contact.isPlaceholder
                      ? ''
                      : `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`
                  }
                  icon={<MessageCircle className="size-4" strokeWidth={1.3} />}
                  label="WhatsApp"
                />
              </li>
              <li>
                <ConnectLink
                  href={contact.isPlaceholder ? '' : `mailto:${contact.email}`}
                  icon={<Mail className="size-4" strokeWidth={1.3} />}
                  label="Email"
                />
              </li>
            </ul>
            {contact.isPlaceholder && (
              <p className="mt-4 max-w-[15rem] text-xs leading-relaxed text-cream-200/45">
                Channels open at launch.
              </p>
            )}
          </div>
        </div>

        {/* --- legal ------------------------------------------------------ */}
        <div className="flex flex-col gap-6 border-t border-brass-500/20 py-8 text-xs text-cream-200/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Kanchi Vastra. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brass-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="#main"
            className="inline-flex items-center gap-3 tracking-[0.24em] uppercase transition-colors hover:text-brass-300"
          >
            <span className="grid size-10 place-items-center rounded-full border border-brass-500/50">
              <ArrowUp className="size-4" strokeWidth={1.3} />
            </span>
            Back to top
          </a>
        </div>

        {/* Honesty notice — remove once real catalogue data is in place. */}
        <p className="border-t border-brass-500/10 py-5 text-[11px] leading-relaxed text-cream-200/40">
          Demonstration build. Product photography, names, prices, stock figures and contact details
          shown on this site are placeholder content and do not represent actual Kanchi Vastra
          merchandise or business information.
        </p>
      </div>
    </footer>
  );
}

/**
 * A round icon link when a destination has been configured, and an
 * unmistakably inert circle when it has not — so nothing on the page pretends
 * to work before the business details exist.
 */
function ConnectLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  if (!href) {
    return (
      <span
        title={`${label} — opens at launch`}
        className="grid size-11 place-items-center rounded-full border border-cream-200/20 text-cream-200/35"
      >
        {icon}
        <span className="sr-only">{label} (opens at launch)</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-brass-500/50 text-cream-100 transition-colors duration-500 hover:bg-brass-500 hover:text-forest-900"
    >
      {icon}
    </a>
  );
}
