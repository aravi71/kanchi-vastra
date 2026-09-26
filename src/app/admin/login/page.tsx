import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionForm } from '@/components/ui/ActionForm';
import { adminLogin } from '@/features/admin/actions/auth';
import { AdminAuthShell } from '@/features/admin/components/AdminAuthShell';
import { getSession } from '@/features/auth/server/session';

export const metadata: Metadata = { title: 'Sign in' };

export default async function AdminLoginPage() {
  const session = await getSession('ADMIN');
  if (session?.twoFactorPassed) redirect('/admin');

  return (
    <AdminAuthShell step="Step 1 of 2" title="Admin sign in" intro="Staff only.">
      <ActionForm
        action={adminLogin}
        submitLabel="Continue"
        tone="ink"
        fields={[
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            autoComplete: 'username',
            required: true,
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            autoComplete: 'current-password',
            required: true,
          },
        ]}
      />
    </AdminAuthShell>
  );
}
