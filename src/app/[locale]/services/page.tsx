import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { routing } from '@/i18n/routing';
import { CATEGORIES } from '@/lib/data/categories';
import { SITE_IMAGES } from '@/lib/data/media';
import type { Locale } from '@/lib/data/types';
import { pageMetadata } from '@/lib/seo';
import styles from './services.module.css';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/services',
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    siteName: t('siteName'),
  });
}

/**
 * One section per approved category. Sub-services, prices and durations are not published,
 * so each section invites a WhatsApp enquiry instead of listing invented details.
 */
export default async function ServicesPage({ params }: PageProps<'/[locale]/services'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'services' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const wa = await getTranslations({ locale, namespace: 'wa' });
  const other: Locale = locale === 'ar' ? 'en' : 'ar';

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.intro}>
        <div className={styles.banner}>
          <Image
            src={SITE_IMAGES.salonInterior.src}
            alt={SITE_IMAGES.salonInterior.alt[locale]}
            fill
            priority
            sizes="(min-width: 77.5rem) 1240px, 100vw"
            className={styles.bannerImg}
          />
          <h1>{t('title')}</h1>
        </div>
        <p className={styles.lede}>{t('intro')}</p>
        <nav aria-label={t('categoriesNav')}>
          <ul className={styles.chips}>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className={styles.chip}>
                  {c.name[locale]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.note}>{common('illustrativeNote')}</p>
      </div>

      <ul className={styles.list}>
        {CATEGORIES.map((c, i) => (
          <li key={c.slug}>
            <section
              id={c.slug}
              className={`${styles.category} ${i % 2 ? styles.flip : ''}`}
              aria-labelledby={`h-${c.slug}`}
            >
              <div className={styles.media}>
                <Image
                  src={c.image.src}
                  alt={c.image.alt[locale]}
                  fill
                  sizes="(min-width: 56rem) 50vw, 100vw"
                  className={styles.mediaImg}
                />
              </div>
              <div className={styles.body}>
                <h2 id={`h-${c.slug}`}>{c.name[locale]}</h2>
                <span lang={other} className={styles.alt}>
                  {c.name[other]}
                </span>
                <WhatsAppButton
                  locale={locale}
                  message={wa('category', { name: c.name[locale] })}
                  variant="secondary"
                >
                  {t('ask')}
                </WhatsAppButton>
              </div>
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
}
