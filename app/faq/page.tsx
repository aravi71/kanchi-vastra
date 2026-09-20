import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Answers to common questions about Sri Kanchi Silks sarees, weaves, care, shipping and returns.',
  alternates: { canonical: '/faq' },
};

/**
 * Questions are answered where we genuinely can, and marked as pending where
 * the business detail does not exist yet. Nothing here invents a policy.
 */
const groups = [
  {
    title: 'The Sarees',
    items: [
      {
        id: 'q-kanchipuram',
        title: 'What makes a saree a Kanchipuram silk?',
        content: (
          <div className="space-y-3">
            <p>
              Technically, the korvai construction: the body and the border are woven from
              separate warps and interlocked by hand where they meet. That is what allows the
              border to be a genuinely different colour and weight from the body.
            </p>
            <p>
              Beyond that, a Kanchipuram is defined by pure mulberry silk, zari worked into the
              border and pallu, and a motif vocabulary drawn largely from temple architecture.
            </p>
          </div>
        ),
      },
      {
        id: 'q-korvai',
        title: 'What is the difference between korvai and a regular weave?',
        content: (
          <p>
            In a korvai saree the border is woven separately and joined to the body thread by
            thread — slower, and visible in the crispness of the seam. In a non-korvai saree
            the body and border share one warp, so the contrast between them is softer. Both are
            legitimate; korvai is more labour-intensive and generally more expensive.
          </p>
        ),
      },
      {
        id: 'q-zari',
        title: 'What kind of zari do you use?',
        content: (
          <p>
            Each product page lists the zari for that specific saree under Specifications —
            typically half-fine or fine gold zari, in either a bright or an antique finish. The
            zari type is the single largest factor in both the weight and the price of a silk
            saree.
          </p>
        ),
      },
      {
        id: 'q-blouse',
        title: 'Does the saree come with a blouse piece?',
        content: (
          <p>
            Yes. Every saree in the collection includes an attached blouse piece, and the
            length and whether it is matching or contrast are listed on each product page. The
            blouse piece is unstitched.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Ordering & Delivery',
    items: [
      {
        id: 'q-payment',
        title: 'How do I pay?',
        content: (
          <div className="space-y-3">
            <p>
              Online payment is <strong>not yet enabled</strong>. You can browse, build a bag
              and enter delivery details, but no order can currently be placed and nothing will
              be charged.
            </p>
            <p>
              A payment gateway is being set up. Until then, please{' '}
              <Link href="/contact" className="link-underline text-wine-700">
                get in touch
              </Link>{' '}
              about anything you are interested in.
            </p>
          </div>
        ),
      },
      {
        id: 'q-shipping',
        title: 'Where do you ship, and how long does it take?',
        content: (
          <div className="space-y-3">
            <p>We intend to ship across India, with tracking provided on every order.</p>
            <p className="text-ink-400">
              Our shipping partners, precise delivery windows and international availability
              are still being confirmed and will be published on the{' '}
              <Link href="/legal/shipping" className="link-underline text-ink-600">
                shipping policy
              </Link>{' '}
              page before the store opens for orders.
            </p>
          </div>
        ),
      },
      {
        id: 'q-returns',
        title: 'Can I return or exchange a saree?',
        content: (
          <div className="space-y-3">
            <p>
              Returns will be accepted on unworn, unwashed sarees with original tags intact.
            </p>
            <p className="text-ink-400">
              The exact return window, who covers return shipping, and the exchange process are
              being finalised. See the{' '}
              <Link href="/legal/returns" className="link-underline text-ink-600">
                returns policy
              </Link>{' '}
              for the current position.
            </p>
          </div>
        ),
      },
      {
        id: 'q-stock',
        title: 'What does “only 2 remaining” mean?',
        content: (
          <p>
            Exactly what it says — the number of that specific saree we currently hold. Silk
            sarees are woven in small numbers and each colourway is limited, so the figure is
            genuinely the stock count rather than a pressure tactic.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Care',
    items: [
      {
        id: 'q-wash',
        title: 'Can I wash a silk saree at home?',
        content: (
          <div className="space-y-3">
            <p>
              Pure silk sarees with zari should be dry cleaned only. Water and detergent damage
              both the fibre and the metallic thread.
            </p>
            <p>
              Silk-cotton weaves are more forgiving and can be gently hand washed in cold
              water. Each product page states which applies.
            </p>
            <Link href="/care-guide" className="link-underline inline-block text-wine-700">
              Read the full care guide
            </Link>
          </div>
        ),
      },
      {
        id: 'q-store',
        title: 'How should I store my sarees?',
        content: (
          <p>
            Folded, in cotton muslin, away from direct sunlight and damp. Refold along a
            different line every few months so the zari does not crease permanently in one
            place. Avoid plastic covers, which trap moisture.
          </p>
        ),
      },
    ],
  },
  {
    title: 'About the Site',
    items: [
      {
        id: 'q-images',
        title: 'Are these photographs of the actual sarees?',
        content: (
          <p>
            No. The images currently on this site are original artwork created for this build,
            not photographs of real merchandise. Product names, prices, SKUs, stock figures and
            contact details are also placeholder content. All of it will be replaced with
            genuine information and photography before launch.
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  // FAQ structured data, built from the same source the page renders.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What makes a saree a Kanchipuram silk?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The korvai construction: the body and the border are woven from separate warps and interlocked by hand, alongside pure mulberry silk and zari worked into the border and pallu.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I wash a silk saree at home?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pure silk sarees with zari should be dry cleaned only. Silk-cotton weaves can be gently hand washed in cold water.',
        },
      },
      {
        '@type': 'Question',
        name: 'How should I store my sarees?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Folded, in cotton muslin, away from direct sunlight and damp. Refold along a different line every few months so the zari does not crease permanently.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="The weave, the care, and how ordering will work. Where something is not settled yet, we say so."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]}
      />

      <div className="container-editorial pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl space-y-14">
          {groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 70}>
              <section>
                <h2 className="eyebrow text-wine-700">{group.title}</h2>
                <Accordion items={group.items} className="mt-6" />
              </section>
            </Reveal>
          ))}

          <Reveal>
            <div className="border border-ivory-300 bg-ivory-200/40 p-8 text-center">
              <h2 className="display-sm font-light">Still have a question?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                If it is not answered here, ask us directly. We would rather have the
                conversation than have you guess.
              </p>
              <ButtonLink href="/contact" className="mt-7">
                Contact Us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
