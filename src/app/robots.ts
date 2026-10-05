import type { MetadataRoute } from 'next';
import { isIndexable, siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // Everything stays unindexed until an approved production launch.
  if (!isIndexable()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', siteUrl()).toString(),
  };
}
