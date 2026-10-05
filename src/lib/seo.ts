import type { Metadata } from 'next';
import { LOCALES, type Locale } from './data/types';

/** Search engines may index the site only when APP_ENV=production. */
export const isIndexable = () => process.env.APP_ENV === 'production';

export function siteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
}

/** Canonical + hreflang alternates for a locale-agnostic path such as `/services`. */
export function localizedAlternates(locale: Locale, path: string): Metadata['alternates'] {
  const clean = path === '/' ? '' : path;
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `/${l}${clean}`]));
  return {
    canonical: `/${locale}${clean}`,
    languages: { ...languages, 'x-default': `/ar${clean}` },
  };
}

export function pageMetadata(args: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  siteName: string;
}): Metadata {
  const { locale, path, title, description, siteName } = args;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      siteName,
      locale: locale === 'ar' ? 'ar_QA' : 'en_QA',
      type: 'website',
    },
    // Set on every page: a page-level key replaces the layout's, so it cannot live only there.
    ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
  };
}
