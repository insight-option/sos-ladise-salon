import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ComingSoon, comingSoonMetadata } from '@/components/layout/ComingSoon';
import { routing } from '@/i18n/routing';

// Scheduled for a later phase; kept as a page so navigation never 404s.
export async function generateMetadata({
  params,
}: PageProps<'/[locale]/gallery'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'nav' });
  return comingSoonMetadata(locale, '/gallery', t('gallery'));
}

export default async function GalleryPage({ params }: PageProps<'/[locale]/gallery'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });
  return <ComingSoon locale={locale} heading={t('gallery')} />;
}
