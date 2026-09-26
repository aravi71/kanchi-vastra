import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionForm } from '@/components/ui/ActionForm';
import { adminLogout, verifyTwoFactor } from '@/features/admin/actions/auth';
import { AdminAuthShell } from '@/features/admin/components/AdminAuthShell';
import { getSession } from '@/features/auth/server/session';

export const metadata: Metadata = { title: 'Enter your code' };

export default async function AdminVerifyPage() {
  const session = await getSession('ADMIN');
  if (!session) redirect('/admin/login');
  if (session.twoFactorPassed) redirect('/admin');
  if (!session.user.twoFactorEnabledAt) redirect('/admin/setup-2fa');

  return (
    <AdminAuthShell
      step="Step 2 of 2"
      title="Enter your code"
      intro="Open your authenticator app and type the 6-digit code shown for Kanchi Vastra."
    >
      <ActionForm
        action={verifyTwoFactor}
        submitLabel="Verify and open admin"
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
