import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ComingSoon, comingSoonMetadata } from '@/components/layout/ComingSoon';
import { routing } from '@/i18n/routing';

// Scheduled for a later phase; kept as a page so navigation never 404s.
export async function generateMetadata({
  params,
}: PageProps<'/[locale]/home-service'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'nav' });
  return comingSoonMetadata(locale, '/home-service', t('homeService'));
}

export default async function HomeServicePage({ params }: PageProps<'/[locale]/home-service'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });
  return <ComingSoon locale={locale} heading={t('homeService')} />;
}
