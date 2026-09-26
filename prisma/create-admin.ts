/**
 * Create or reset a staff account for the admin panel.
 *
 *   echo "<password>" | docker compose run --rm -T tools \
 *     npx tsx prisma/create-admin.ts --email owner@example.com --name "Owner" [--role ADMIN] [--reset-2fa]
 *
 * The password is read from standard input, never from the command line
 * (command lines are visible to other processes and shell history).
 * --reset-2fa clears the authenticator link, e.g. after a lost phone; the
 * person sets it up again at their next sign-in.
 */
import 'dotenv/config';
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8').trim();
}

async function main() {
  const email = arg('email')?.trim().toLowerCase();
  const name = arg('name') ?? null;
  const role = (arg('role') ?? 'ADMIN') as Role;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('--email is required');
  if (!['ADMIN', 'STAFF'].includes(role)) throw new Error('--role must be ADMIN or STAFF');

  const password = await readStdin();
  if (password.length < 12) throw new Error('Password (on stdin) must be at least 12 characters.');

  // Same format as src/lib/security/crypto.ts hashPassword().
  const N = 2 ** 15,
    r = 8,
    p = 1;
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize('NFKC'), salt, 64, {
    N,
    r,
    p,
    maxmem: 128 * 1024 * 1024,
  });
  const passwordHash = ['scrypt', N, r, p, salt.toString('base64'), key.toString('base64')].join(
    '$',
  );

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
  const reset2fa = process.argv.includes('--reset-2fa');
  const user = await db.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role,
      isActive: true,
      ...(name ? { name } : {}),
      ...(reset2fa ? { twoFactorSecret: null, twoFactorEnabledAt: null } : {}),
    },
    create: { email, name, role, passwordHash },
  });
  await db.session.deleteMany({ where: { userId: user.id } });
  console.log(`  ${role} account ready: ${email}${reset2fa ? ' (authenticator reset)' : ''}`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error('  create-admin failed:', (e as Error).message);
  process.exit(1);
});
