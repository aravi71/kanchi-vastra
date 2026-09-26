import 'server-only';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from 'node:crypto';
import { serverEnv } from '@/config/env.server';

/* ===========================================================================
   Cryptographic helpers — Node's built-in, audited primitives only.
   =========================================================================== */

/* --- passwords: scrypt (memory-hard; OWASP-recommended) ------------------- */

const SCRYPT = { N: 2 ** 15, r: 8, p: 1, keylen: 64 } as const;

function scryptAsync(password: string, salt: Buffer, opts: ScryptOptions & { keylen: number }) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password.normalize('NFKC'),
      salt,
      opts.keylen,
      { ...opts, maxmem: 128 * 1024 * 1024 },
      (err, key) => (err ? reject(err) : resolve(key)),
    ),
  );
}

/** "scrypt$N$r$p$<salt b64>$<hash b64>" — parameters travel with the hash. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, SCRYPT);
  return [
    'scrypt',
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString('base64'),
    key.toString('base64'),
  ].join('$');
}

export async function verifyPassword(
  password: string,
  stored: string | null | undefined,
): Promise<boolean> {
  // Unknown user: still spend the same time, so response timing does not
  // reveal which emails have accounts.
  const parts = (stored ?? DUMMY_HASH).split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, N, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = await scryptAsync(password, Buffer.from(saltB64, 'base64'), {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    keylen: expected.length,
  });
  return stored != null && actual.length === expected.length && timingSafeEqual(actual, expected);
}

// A valid hash of a random password, used only to equalise timing.
const DUMMY_HASH =
  'scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' + Buffer.alloc(64, 7).toString('base64');

/* --- tokens ---------------------------------------------------------------- */

/** 256 bits of randomness, URL-safe. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

/** Tokens are stored hashed, so a database leak does not leak live sessions. */
export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/* --- secrets at rest: AES-256-GCM ------------------------------------------ */

function key(): Buffer {
  const k = Buffer.from(serverEnv('auth').APP_ENCRYPTION_KEY, 'base64');
  if (k.length !== 32) throw new Error('APP_ENCRYPTION_KEY must be 32 bytes, base64-encoded.');
  return k;
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [
    'v1',
    iv.toString('base64'),
    cipher.getAuthTag().toString('base64'),
    data.toString('base64'),
  ].join('.');
}

export function decrypt(sealed: string): string {
  const [v, iv, tag, data] = sealed.split('.');
  if (v !== 'v1') throw new Error('Unknown ciphertext version');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString(
    'utf8',
  );
}
