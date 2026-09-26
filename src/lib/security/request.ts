import 'server-only';
import { headers } from 'next/headers';

/**
 * The visitor's IP and browser, as reported by Caddy.
 *
 * Caddy sets X-Forwarded-For itself and does not pass through values sent by
 * the client (no trusted proxies are configured), so the first entry is the
 * real client address. The app is reachable only through Caddy.
 */
export async function requestContext(): Promise<{ ip: string; userAgent: string }> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  return {
    ip: forwarded || h.get('x-real-ip') || 'unknown',
    userAgent: (h.get('user-agent') ?? 'unknown').slice(0, 300),
  };
}
