import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/home/Hero';
import {
  CategoriesSection,
  HomeServiceSection,
  ContactSection,
} from '@/components/home/HomeSections';
import { routing } from '@/i18n/routing';
import { getRepository } from '@/lib/data/repository';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    ...pageMetadata({
      locale,
      path: '/',
      title: t('homeTitle'),
      description: t('homeDescription'),
      siteName: t('siteName'),
    }),
    title: { absolute: t('homeTitle') },
  };
}

/**
 * Sections with no approved content (gallery, about/team, testimonials) are not rendered at all
 * until real data exists — spec §4.1.5–7.
 */
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const repo = getRepository();
  const [categories, settings] = await Promise.all([repo.getCategories(), repo.getSettings()]);

  return (
    <>
      <Hero locale={locale} />
      <CategoriesSection locale={locale} categories={categories} />
      <HomeServiceSection locale={locale} />
      <ContactSection locale={locale} settings={settings} />
    </>
  );
}
