import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma CLI settings (migrate, generate, seed). The connection string comes
 * from DATABASE_URL in the environment — never from this file.
 *
 * Locally: .env.local is not read by dotenv, so run migrations with the
 * variable set, e.g. through an SSH tunnel to the server's database.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
