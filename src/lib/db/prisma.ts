import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { isProduction, serverEnv } from '@/config/env.server';

/**
 * The one Prisma client for the whole application.
 *
 * `server-only` makes importing this from a Client Component a build error,
 * so database credentials can never be bundled for the browser. The
 * connection string comes from the validated settings module, never from
 * code.
 *
 * Prisma 7 connects through a driver adapter (node-postgres). The client is
 * created on first use, so pages that never touch the database do not need
 * DATABASE_URL at all.
 *
 * In development the client is cached on globalThis: `next dev` re-evaluates
 * modules on every edit, and without the cache each reload would open a new
 * connection pool until PostgreSQL refused connections.
 */

const createClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: serverEnv('database').DATABASE_URL }),
    log: isProduction ? ['error'] : ['warn', 'error'],
  });

type Client = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as { prisma?: Client };

export function db(): Client {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
}
