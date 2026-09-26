import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Docker image runs `node server.js` from this traced bundle instead
  // of shipping the whole node_modules folder.
  output: 'standalone',
  images: {
    // Every image is pre-sized in the photo storage (WebP
    // renditions) — see src/lib/image-loader.ts.
    // The app itself never fetches or processes images.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  // A page may be served stale while it re-renders, but never for longer
  // than this. Without a cap, Next's default lets a page for a saree you
  // deleted keep answering 200 more or less indefinitely, because each
  // re-render finds it missing and the last good copy is kept.
  expireTime: 180,
  poweredByHeader: false,

  /**
   * Security headers for every response. HSTS is set by Caddy, which owns
   * HTTPS. A full script CSP needs per-request nonces, so this policy covers the directives that are
   * safe everywhere: no plugins, no <base> hijacking, no framing by other
   * sites, forms post only to this site.
   */
  async headers() {
    const csp = [
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
