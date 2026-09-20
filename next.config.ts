import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  poweredByHeader: false,
};

export default nextConfig;
