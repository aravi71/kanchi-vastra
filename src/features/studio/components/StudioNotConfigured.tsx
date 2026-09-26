import { Monogram } from '@/components/ui/Logo';

/**
 * Shown at /studio before the CMS is connected. A shop owner who clicks the
 * link early should get instructions, not a stack trace.
 */
export function StudioNotConfigured() {
  const steps = [
    {
      n: '1',
      title: 'Create a free Sanity account',
      body: (
        <>
          Go to{' '}
          <a
            href="https://www.sanity.io/get-started"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-wine-700"
          >
            sanity.io/get-started
          </a>{' '}
          and sign up with Google or GitHub. No card is needed — the free plan
          covers far more than this shop will use.
        </>
      ),
    },
    {
      n: '2',
      title: 'Create a project',
      body: 'Name it "Kanchi Vastra" and choose the "production" dataset. Copy the Project ID it gives you — a short code like a1b2c3d4.',
    },
    {
      n: '3',
      title: 'Tell the site about it',
      body: (
        <>
          In the project folder, open <code className="text-ink-900">.env.local</code> and
          add these two lines, using your own Project ID:
          <pre className="mt-3 overflow-x-auto border border-ivory-300 bg-ivory-200/60 p-4 text-xs leading-relaxed text-ink-800">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
NEXT_PUBLIC_SANITY_DATASET=production`}
          </pre>
        </>
      ),
    },
    {
      n: '4',
      title: 'Load your sarees in',
      body: (
        <>
          Run <code className="text-ink-900">npm run cms:seed</code> to copy the current
          catalogue into the CMS, then restart with{' '}
          <code className="text-ink-900">npm run dev</code>. Come back here and you will
          have a full admin.
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 px-5 py-20">
      <div className="mx-auto max-w-2xl">
        <Monogram className="text-gold-600" size={40} />

        <p className="eyebrow mt-8 text-wine-700">Admin</p>
        <h1 className="display-lg mt-4 font-light">Not connected yet</h1>
        <p className="mt-5 text-[0.9375rem] leading-[1.85] text-ink-600">
          This is where you will add sarees, upload photos and set prices. It needs a free
          Sanity account first — about five minutes, once.
        </p>

        <ol className="mt-12 space-y-9">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-6">
              <span className="font-[family-name:var(--font-display)] text-2xl tnum text-gold-600">
                {step.n}
              </span>
              <div className="flex-1 border-b border-ivory-300 pb-9">
                <h2 className="display-sm font-light">{step.title}</h2>
                <div className="mt-3 text-sm leading-[1.85] text-ink-600">{step.body}</div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm leading-relaxed text-ink-500">
          The full walkthrough, including how to put this admin online so you can use it
          from your phone, is in <code className="text-ink-900">CMS-SETUP.md</code> in the
          project folder.
        </p>

        <p className="mt-8 border-t border-ivory-300 pt-6 text-xs leading-relaxed text-ink-400">
          Until this is connected the shop still works normally — it is serving the
          demonstration catalogue from the project files.
        </p>
      </div>
    </div>
  );
}
