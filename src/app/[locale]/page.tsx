import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/home/Hero';
import {
  CategoriesSection,
  ContactSection,
  HomeServiceSection,
} from '@/components/home/HomeSections';
import { routing } from '@/i18n/routing';
import { CATEGORIES } from '@/lib/data/categories';
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

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Hero locale={locale} />
      <CategoriesSection locale={locale} categories={CATEGORIES} />
      <HomeServiceSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  );
}
