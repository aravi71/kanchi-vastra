import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ActionForm } from '@/components/ui/ActionForm';
import { login } from '@/features/auth/actions/customer';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { getSession } from '@/features/auth/server/session';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  if (await getSession('CUSTOMER')) redirect('/account');
  const { next, reset } = await searchParams;

  return (
    <AuthCard
      eyebrow="My account"
      title="Sign in"
      intro={reset ? 'Your password was changed. Sign in with the new one.' : 'Welcome back.'}
    >
      <ActionForm
        action={login}
        submitLabel="Sign in"
        hidden={next ? { next } : undefined}
        fields={[
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            autoComplete: 'current-password',
            required: true,
          },
        ]}
        footer={
          <div className="flex flex-wrap justify-between gap-3 text-sm text-ink-500">
            <Link href="/account/forgot" className="link-underline">
              Forgot password?
            </Link>
            <Link href="/account/register" className="link-underline text-wine-800">
              Create an account
            </Link>
          </div>
        }
      />
    </AuthCard>
  );
}
