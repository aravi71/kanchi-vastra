import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionForm } from '@/components/ui/ActionForm';
import { requestPasswordReset } from '@/features/auth/actions/customer';
import { AuthCard } from '@/features/auth/components/AuthCard';

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <AuthCard
      eyebrow="My account"
      title="Forgot your password?"
      intro="Enter your email and we will send a link to choose a new one."
    >
      <ActionForm
        action={requestPasswordReset}
        submitLabel="Send reset link"
        fields={[
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
        ]}
        footer={
          <Link href="/account/login" className="link-underline text-sm text-ink-500">
            Back to sign in
          </Link>
        }
      />
    </AuthCard>
  );
}
