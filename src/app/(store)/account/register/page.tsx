import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ActionForm } from '@/components/ui/ActionForm';
import { register } from '@/features/auth/actions/customer';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { getSession } from '@/features/auth/server/session';

export const metadata: Metadata = {
  title: 'Create an account',
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  if (await getSession('CUSTOMER')) redirect('/account');

  return (
    <AuthCard
      eyebrow="My account"
      title="Create an account"
      intro="Save your details, follow your orders and keep a wishlist on every device."
    >
      <ActionForm
        action={register}
        submitLabel="Create account"
        fields={[
          { name: 'name', label: 'Full name', autoComplete: 'name', required: true, maxLength: 80 },
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
          {
            name: 'phone',
            label: 'Mobile (optional)',
            type: 'tel',
            autoComplete: 'tel',
            inputMode: 'tel',
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            autoComplete: 'new-password',
            required: true,
            hint: 'At least 10 characters. A short sentence is easy to remember and hard to guess.',
          },
        ]}
        footer={
          <p className="text-sm text-ink-500">
            Already have an account?{' '}
            <Link href="/account/login" className="link-underline text-wine-800">
              Sign in
            </Link>
          </p>
        }
      />
    </AuthCard>
  );
}
