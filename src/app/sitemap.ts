import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/seo';

// Only routes with real content are listed; placeholder pages are noindex and omitted.
const PATHS = ['', '/services'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: new URL(`/${locale}${path}`, base).toString(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, new URL(`/${l}${path}`, base).toString()]),
        ),
      },
    })),
  );
}
