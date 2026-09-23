import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * The one Prisma client for the whole application.
 *
 * `server-only` at the top is deliberate: importing this from a Client
 * Component becomes a build error rather than a runtime leak of database
 * credentials into the browser bundle.
 *
 * Prisma 7 connects through a driver adapter. We use node-postgres against
 * Neon's POOLED url, because a Next.js server opens and closes work units
 * constantly and a connection pooler is what keeps that from exhausting the
 * database's connection limit.
 *
 * The globalThis cache exists because `next dev` hot-reloads modules on every
 * edit; without it each reload would construct another client and leak
 * connections until Postgres refused new ones.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string.',
  );
}

const createClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

type PrismaClientSingleton = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
