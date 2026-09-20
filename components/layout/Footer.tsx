import Link from 'next/link';
import { AtSign, Mail, MessageCircle } from 'lucide-react';
import { contact, footerNav, site } from '@/data/site';
import { Logo } from '@/components/ui/Logo';
import { TempleBorder } from '@/components/motifs/Motifs';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

const columns = [
  { title: 'Shop', links: footerNav.shop },
  { title: 'About', links: footerNav.about },
  { title: 'Help', links: footerNav.help },
];

export function Footer() {
  return (
    <footer className="relative mt-px bg-wine-950 text-ivory-200">
      <TempleBorder className="text-gold-600/35" height={12} />

      <div className="container-editorial">
        {/* --- newsletter ------------------------------------------------- */}
        <div className="grid gap-10 border-b border-ivory-100/10 py-16 md:grid-cols-2 md:items-end md:gap-16 lg:py-20">
          <div>
            <p className="eyebrow text-gold-400/80">The Atelier Letter</p>
            <h2 className="display-md mt-4 max-w-md text-balance font-light text-ivory-100">
              New weaves, quietly announced
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory-200/65">
              Occasional notes on new arrivals and the craft behind them. No noise.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* --- navigation ------------------------------------------------- */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-20">
          <div className="lg:col-span-2">
            <Logo orientation="horizontal" markClassName="text-gold-400" className="text-ivory-100" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory-200/60">
              {site.positioning}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow-sm text-gold-400/80">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-ivory-200/75 transition-colors duration-500 hover:text-ivory-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="eyebrow-sm text-gold-400/80">Connect</h3>
            <ul className="mt-5 space-y-3 text-sm text-ivory-200/75">
              <li>
                <ConnectLink
                  href={contact.social.instagram}
                  icon={<AtSign className="size-4" strokeWidth={1.3} />}
                  label="Instagram"
                />
              </li>
              <li>
                <ConnectLink
                  href={contact.isPlaceholder ? '' : `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
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
              <p className="mt-4 max-w-[15rem] text-xs leading-relaxed text-ivory-200/40">
                Channels open at launch.
              </p>
            )}
          </div>
        </div>

        {/* --- legal ------------------------------------------------------ */}
        <div className="flex flex-col gap-5 border-t border-ivory-100/10 py-8 text-xs text-ivory-200/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sri Kanchi Silks. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline transition-colors hover:text-ivory-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Honesty notice — remove once real catalogue data is in place. */}
        <p className="border-t border-ivory-100/5 py-5 text-[11px] leading-relaxed text-ivory-200/35">
          Demonstration build. Product photography, names, prices, stock figures and contact
          details shown on this site are placeholder content and do not represent actual
          Sri Kanchi Silks merchandise or business information.
        </p>
      </div>
    </footer>
  );
}

/**
 * Renders a live link when a destination has been configured, and an
 * unmistakably inert label when it has not — so nothing on the page pretends
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
      <span className="inline-flex items-center gap-2.5 text-ivory-200/40">
        {icon}
        {label}
        <span className="text-[10px] uppercase tracking-[0.18em]">soon</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline inline-flex items-center gap-2.5 transition-colors duration-500 hover:text-ivory-50"
    >
      {icon}
      {label}
    </a>
  );
}
