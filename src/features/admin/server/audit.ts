import 'server-only';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db/prisma';
import { requestContext } from '@/lib/security/request';
import type { ActiveSession } from '@/features/auth/server/session';

/** Records an admin action: who, what, which record, the change, from where. */
export async function audit(
  session: ActiveSession,
  action: string,
  entity: string,
  entityId: string | null,
  details?: Record<string, unknown>,
): Promise<void> {
  const { ip } = await requestContext();
  await db().auditLog.create({
    data: {
      userId: session.user.id,
      actorEmail: session.user.email,
      action,
      entity,
      entityId,
      // Round-trip through JSON: stores exactly what a reader will get back.
      details: details ? (JSON.parse(JSON.stringify(details)) as Prisma.InputJsonValue) : undefined,
      ip,
    },
  });
}

/** Field-by-field before/after for the fields that actually changed. */
export function diff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Record<string, { from: unknown; to: unknown }> {
  const out: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of Object.keys(after)) {
    const a =
      before[key] instanceof Object ? JSON.stringify(before[key]) : String(before[key] ?? '');
    const b = after[key] instanceof Object ? JSON.stringify(after[key]) : String(after[key] ?? '');
    if (a !== b) out[key] = { from: before[key] ?? null, to: after[key] ?? null };
  }
  return out;
}
