import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Public origin for canonical/hreflang URLs. An explicit NEXT_PUBLIC_SITE_URL wins (custom domain);
 * on Amplify builds it falls back to the branch's default domain, which Amplify serves over https.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const { AWS_APP_ID, AWS_BRANCH } = process.env;
  if (AWS_APP_ID && AWS_BRANCH) {
    return `https://${AWS_BRANCH.replace(/[^a-zA-Z0-9-]/g, '-')}.${AWS_APP_ID}.amplifyapp.com`;
  }
  return 'http://localhost:3000';
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pure static site (HTML/CSS/JS in `out/`): no server runtime, so hosting needs no
  // Next.js SSR support. Folders with index.html keep URLs like /ar/services/ working on any CDN.
  output: 'export',
  trailingSlash: true,
  // The image optimizer needs a server; images are pre-sized WebP files instead.
  images: { unoptimized: true },
  // Inlined at build time.
  env: {
    NEXT_PUBLIC_SITE_URL: resolveSiteUrl(),
    APP_ENV: process.env.APP_ENV ?? 'preview',
  },
};

export default withNextIntl(nextConfig);
