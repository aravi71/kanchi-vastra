import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import QRCode from 'qrcode';
import { ActionForm } from '@/components/ui/ActionForm';
import { adminLogout, confirmTwoFactorSetup } from '@/features/admin/actions/auth';
import { AdminAuthShell } from '@/features/admin/components/AdminAuthShell';
import { pendingTwoFactorSecret } from '@/features/admin/server/two-factor';
import { getSession } from '@/features/auth/server/session';
import { totpUri } from '@/lib/security/totp';

export const metadata: Metadata = { title: 'Protect your account' };

export default async function SetupTwoFactorPage() {
  const session = await getSession('ADMIN');
  if (!session) redirect('/admin/login');
  if (session.user.twoFactorEnabledAt)
    redirect(session.twoFactorPassed ? '/admin' : '/admin/verify');

  const secret = await pendingTwoFactorSecret(session.user.id);
  const qr = await QRCode.toDataURL(totpUri(secret, session.user.email), { margin: 1, width: 220 });

  return (
    <AdminAuthShell
      step="One-time setup"
      title="Protect your account"
      intro="Admin needs a password AND a code from your phone, so a stolen password alone cannot get in."
    >
      <ol className="space-y-3 text-sm text-ink-600">
        <li>
          <strong>1.</strong> Install <strong>Google Authenticator</strong> (or Microsoft
          Authenticator) on your phone.
        </li>
        <li>
          <strong>2.</strong> In the app tap <strong>+</strong> → <strong>Scan a QR code</strong>,
          and scan this:
        </li>
      </ol>
      {/* eslint-disable-next-line @next/next/no-img-element -- inline data URL, no optimisation needed */}
      <img
        src={qr}
        alt="QR code for your authenticator app"
        width={220}
        height={220}
        className="mx-auto my-5"
      />
      <p className="text-center text-xs text-ink-400">
        Can&apos;t scan? Enter this key instead:
        <br />
        <code className="mt-1 inline-block rounded bg-ivory-200 px-2 py-1 font-mono text-[0.8rem] tracking-wider text-ink-800 select-all">
          {secret.match(/.{1,4}/g)?.join(' ')}
        </code>
      </p>
      <p className="mt-6 mb-4 text-sm text-ink-600">
        <strong>3.</strong> Type the 6-digit code the app now shows:
      </p>
      <ActionForm
        action={confirmTwoFactorSetup}
        submitLabel="Turn on and open admin"
        tone="ink"
        fields={[
          {
            name: 'code',
            label: '6-digit code',
            autoComplete: 'one-time-code',
            inputMode: 'numeric',
            maxLength: 6,
            required: true,
          },
        ]}
      />
      <form action={adminLogout} className="mt-4 text-center">
        <button className="text-xs text-ink-400 underline underline-offset-4">Cancel</button>
      </form>
    </AdminAuthShell>
  );
}
