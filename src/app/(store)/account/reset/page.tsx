import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionForm } from '@/components/ui/ActionForm';
import { resetPassword } from '@/features/auth/actions/customer';
import { AuthCard } from '@/features/auth/components/AuthCard';

export const metadata: Metadata = {
  title: 'Choose a new password',
  robots: { index: false, follow: false },
  // The token is in the URL: never leak it to other sites.
  referrer: 'no-referrer',
};

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthCard eyebrow="My account" title="Choose a new password">
      {token ? (
        <ActionForm
          action={resetPassword}
          submitLabel="Save new password"
          hidden={{ token }}
          fields={[
            {
              name: 'password',
              label: 'New password',
              type: 'password',
              autoComplete: 'new-password',
              required: true,
              hint: 'At least 10 characters.',
            },
          ]}
        />
      ) : (
        <p className="text-sm text-ink-500">
          This link is incomplete.{' '}
          <Link href="/account/forgot" className="link-underline text-wine-800">
            Ask for a new one
          </Link>
          .
        </p>
      )}
    </AuthCard>
  );
}
