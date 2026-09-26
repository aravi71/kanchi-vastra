/**
 * A Sanity client with write access, for maintenance scripts only.
 *
 * Credentials, in order:
 *   1. SANITY_API_TOKEN, if set (CI / unattended use)
 *   2. the session saved by `npx sanity login` on this computer
 * No token is ever written to the project or printed.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { createClient } from '@sanity/client';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Load .env.local into process.env without overriding real env vars. */
function loadEnvLocal() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function resolveToken() {
  if (process.env.SANITY_API_TOKEN) return process.env.SANITY_API_TOKEN;
  const cliConfig = join(homedir(), '.config', 'sanity', 'config.json');
  try {
    if (existsSync(cliConfig)) return JSON.parse(readFileSync(cliConfig, 'utf8')).authToken;
  } catch {
    /* fall through */
  }
  return undefined;
}

export function die(lines) {
  console.error('\n' + [].concat(lines).join('\n') + '\n');
  process.exit(1);
}

export function sanityAdminClient() {
  loadEnvLocal();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  if (!projectId) die('  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local.');

  const token = resolveToken();
  if (!token) {
    die([
      '  No Sanity credentials found. Log in once and scripts will use that session:',
      '      npx sanity login',
      '  or set SANITY_API_TOKEN (npx sanity tokens create "ci" --role editor).',
    ]);
  }

  return createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false });
}
