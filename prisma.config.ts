import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7 moved connection URLs out of schema.prisma into this file.
 *
 * Migrations use DIRECT_URL — Neon's unpooled endpoint. Running DDL through
 * the pooler can fail or hang, because a pooled connection is not guaranteed
 * to be the same backend session between statements. The app itself uses the
 * pooled DATABASE_URL, wired up in lib/db/prisma.ts.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
});
