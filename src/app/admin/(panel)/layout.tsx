import type { ReactNode } from 'react';
import { requireAdmin } from '@/features/admin/server/guard';
import { AdminNav } from '@/features/admin/components/AdminNav';

/** Every page in the panel requires a fully signed-in (password + code) admin. */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="md:grid md:min-h-svh md:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminNav name={session.user.name ?? session.user.email} role={session.user.role} />
      <main className="px-5 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
