import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { HomeServiceSteps } from '@/components/home/HomeSections';
import { routing } from '@/i18n/routing';
import { SITE_IMAGES } from '@/lib/data/media';
import { pageMetadata } from '@/lib/seo';
import styles from './home-service.module.css';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/home-service'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/home-service',
    title: t('homeServiceTitle'),
    description: t('homeServiceDescription'),
    siteName: t('siteName'),
  });
}

/** Home visits are arranged on WhatsApp; available services and areas are not published. */
export default async function HomeServicePage({ params }: PageProps<'/[locale]/home-service'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'homeService' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const wa = await getTranslations({ locale, namespace: 'wa' });
  const gallery = [SITE_IMAGES.homeServiceManicure, SITE_IMAGES.homeServiceKit];

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.lead}>
        <div className={styles.text}>
          <h1>{t('title')}</h1>
          <p>{t('intro')}</p>
          <WhatsAppButton locale={locale} message={wa('home')} size="lg">
            {t('cta')}
          </WhatsAppButton>
        </div>
        <div className={styles.heroMedia}>
          <Image
            src={SITE_IMAGES.homeServiceHero.src}
            alt={SITE_IMAGES.homeServiceHero.alt[locale]}
            fill
            priority
            sizes="(min-width: 56rem) 50vw, 100vw"
            className={styles.img}
          />
        </div>
      </div>

      <section className={styles.how} aria-labelledby="how-title">
        <h2 id="how-title">{t('howTitle')}</h2>
        <HomeServiceSteps locale={locale} />
      </section>

      <ul className={styles.gallery}>
        {gallery.map((img) => (
          <li key={img.src} className={styles.galleryItem}>
            <Image
              src={img.src}
              alt={img.alt[locale]}
              fill
              sizes="(min-width: 40rem) 50vw, 100vw"
              className={styles.img}
            />
          </li>
        ))}
      </ul>
      <p className={styles.note}>{common('illustrativeNote')}</p>
    </div>
  );
}
