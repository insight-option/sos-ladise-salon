import type { Metadata } from 'next';
import { LOCALES, type Locale } from './data/types';

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
  noindex?: boolean;
}): Metadata {
  const { locale, path, title, description, siteName, noindex } = args;
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
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
