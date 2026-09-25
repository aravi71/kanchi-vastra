import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Docker image runs `node server.js` from this traced bundle instead
  // of shipping the whole node_modules folder.
  output: 'standalone',
  images: {
    // Demo artwork ships as SVG in /public. When real saree photography
    // replaces it, remove `dangerouslyAllowSVG` and add remotePatterns here.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    // Photographs uploaded through the CMS are served from Sanity's CDN.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  // A page may be served stale while it re-renders, but never for longer
  // than this. Without a cap, Next's default lets a page for a saree you
  // deleted keep answering 200 more or less indefinitely, because each
  // re-render finds it missing and the last good copy is kept.
  expireTime: 180,
  poweredByHeader: false,
};

export default nextConfig;
