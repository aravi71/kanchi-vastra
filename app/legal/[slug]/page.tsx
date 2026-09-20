import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { legalPages } from '@/data/legal';

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) return { title: 'Page not found' };

  return {
    title: page.title,
    description: page.summary,
    alternates: { canonical: `/legal/${slug}` },
    // These are drafts, not finalised policy. Keep them out of the index
    // until the business has reviewed and approved the wording.
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={page.title}
        description={page.summary}
        crumbs={[{ label: 'Home', href: '/' }, { label: page.title }]}
      />

      <div className="container-editorial pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Unmissable, and deliberately so. */}
          <Reveal>
            <div className="flex gap-4 border-l-2 border-terracotta-500 bg-ivory-200/60 p-6">
              <AlertTriangle
                className="mt-0.5 size-5 shrink-0 text-terracotta-500"
                strokeWidth={1.4}
              />
              <div className="text-sm leading-relaxed text-ink-600">
                <p className="eyebrow-sm text-ink-900">Draft — not legally reviewed</p>
                <p className="mt-2.5">
                  This page is a structural placeholder written to be replaced. It has not been
                  drafted or reviewed by a legal professional, it does not reflect finalised
                  Sri Kanchi Silks policy, and it should not be relied upon. Replace the content
                  in <code className="text-xs">data/legal.ts</code> with wording approved by your
                  own legal adviser before launch.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 space-y-11">
            {page.sections.map((section, i) => (
              <Reveal key={section.heading} delay={i * 50}>
                <section>
                  <h2 className="display-sm font-light">{section.heading}</h2>
                  <div className="mt-4 space-y-3.5 text-[0.9375rem] leading-[1.9] text-ink-600">
                    {section.body.map((p) => (
                      <p key={p.slice(0, 28)}>{p}</p>
                    ))}
                  </div>
                  {section.pending && (
                    <p className="mt-4 border-l border-gold-500 py-1 pl-4 text-sm text-ink-400">
                      {section.pending}
                    </p>
                  )}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 border-t border-ivory-300 pt-8 text-sm text-ink-500">
              <p>
                Questions about this page?{' '}
                <Link href="/contact" className="link-underline text-wine-700">
                  Get in touch
                </Link>
                .
              </p>
              <p className="mt-2 text-xs text-ink-400">
                Last updated: not yet published. This document has no effective date because it
                has not been finalised.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
