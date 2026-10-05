import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // Everything stays unindexed until an approved production launch.
  if (process.env.APP_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/*/account', '/*/book'] },
    sitemap: new URL('/sitemap.xml', siteUrl()).toString(),
  };
}
