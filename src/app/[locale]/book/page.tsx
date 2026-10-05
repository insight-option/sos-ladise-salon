import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { routing } from '@/i18n/routing';
import { sanitizeDraft } from '@/lib/booking/draft';
import { getRepository } from '@/lib/data/repository';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/book'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/book',
    title: t('bookTitle'),
    description: t('bookDescription'),
    siteName: t('siteName'),
    noindex: true,
  });
}

export default async function BookPage({ params, searchParams }: PageProps<'/[locale]/book'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const query = await searchParams;
  const repo = getRepository();
  const [services, zones, hours, settings] = await Promise.all([
    repo.getServices(),
    repo.getActiveZones(),
    repo.getBusinessHours(),
    repo.getSettings(),
  ]);

  // Only whitelisted, validated query values seed the flow (e.g. from "Book" buttons).
  const initial = sanitizeDraft({ place: query.place, serviceSlug: query.service });

  return (
    <BookingFlow
      initial={initial}
      services={services}
      zones={zones}
      hours={hours}
      homeTravelMinutes={settings.homeTravelMinutes}
      isDemo={repo.isDemo}
    />
  );
}
