import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { contact } from '@/config/site';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactForm } from '@/components/layout/ContactForm';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Kanchi Vastra about a saree, an order or a commission.',
  alternates: { canonical: '/contact' },
};

/**
 * Every contact channel is a placeholder until the business details exist.
 * Rather than print a plausible-looking fake phone number, each row says
 * plainly that it is still to be confirmed.
 */
const channels = [
  { icon: Phone, label: 'Phone', value: contact.phone },
  { icon: MessageCircle, label: 'WhatsApp', value: contact.whatsapp },
  { icon: Mail, label: 'Email', value: contact.email },
];

export default function ContactPage() {
  const pending = contact.isPlaceholder;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        description="Questions about a weave, a size, an order or a commission — we would rather you asked."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        divider
      />

      <div className="container-editorial pb-24 md:pb-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-20">
          {/* --- form --- */}
          <Reveal>
            <h2 className="eyebrow text-wine-700">Send a message</h2>
            <ContactForm />
          </Reveal>

          {/* --- details --- */}
          <Reveal delay={90} as="aside">
            <div className="border border-ivory-300 bg-ivory-200/40 p-7">
              <h2 className="eyebrow">Reach us directly</h2>

              {pending && (
                <p className="mt-5 border-l-2 border-gold-500 bg-ivory-100/60 py-3 pl-4 text-xs leading-relaxed text-ink-500">
                  Our contact channels are being set up. The details below are placeholders and will
                  be replaced with real ones before launch.
                </p>
              )}

              <ul className="mt-6 space-y-5">
                {channels.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex gap-3.5">
                    <Icon className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={1.3} />
                    <div>
                      <p className="eyebrow-sm text-ink-400">{label}</p>
                      <p className="mt-1 text-sm text-ink-600">
                        {pending ? 'To be confirmed' : value}
                      </p>
                    </div>
                  </li>
                ))}

                <li className="flex gap-3.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={1.3} />
                  <div>
                    <p className="eyebrow-sm text-ink-400">Store</p>
                    <address className="mt-1 text-sm leading-relaxed text-ink-600 not-italic">
                      {pending ? (
                        'Store address to be confirmed'
                      ) : (
                        <>
                          {contact.address.line1}
                          <br />
                          {contact.address.city}, {contact.address.state} {contact.address.pincode}
                        </>
                      )}
                    </address>
                  </div>
                </li>

                <li className="flex gap-3.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={1.3} />
                  <div>
                    <p className="eyebrow-sm text-ink-400">Hours</p>
                    <ul className="mt-1 space-y-1 text-sm text-ink-600">
                      {contact.hours.map((h) => (
                        <li key={h.days}>
                          {h.days} — {h.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
