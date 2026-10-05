import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link } from '@/i18n/navigation';
import { SITE_IMAGES } from '@/lib/data/media';
import type { Category, Locale, SalonSettings } from '@/lib/data/types';
import styles from './HomeSections.module.css';

export async function CategoriesSection({
  locale,
  categories,
}: {
  locale: Locale;
  categories: readonly Category[];
}) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const other: Locale = locale === 'ar' ? 'en' : 'ar';
  return (
    <section className={`${styles.section} ${styles.band}`} aria-labelledby="categories-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="categories-title">{t('categoriesTitle')}</h2>
          <Link href="/services" className={styles.moreLink}>
            {t('allServices')}
            <Icon name="arrow" size={18} directional />
          </Link>
        </div>
        <ul className={styles.categories}>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/services#${c.slug}`} className={styles.categoryCard}>
                <span className={styles.categoryMedia}>
                  {c.image?.src ? (
                    <Image
                      src={c.image.src}
                      alt={c.image.alt[locale]}
                      fill
                      sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 33vw, 50vw"
                      className={styles.categoryImg}
                    />
                  ) : (
                    <Icon name={c.slug} size={32} />
                  )}
                </span>
                <span className={styles.categoryText}>
                  <span className={styles.categoryName}>{c.name[locale]}</span>
                  <span lang={other} className={styles.categoryAlt}>
                    {c.name[other]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.imageNote}>{common('illustrativeNote')}</p>
      </div>
    </section>
  );
}

/** Generic, non-binding teaser until home services and zones are approved (spec §4.1.4). */
export async function HomeServiceSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const image = SITE_IMAGES.homeServiceHero;
  return (
    <section className={styles.section} aria-labelledby="home-service-title">
      <div className="container">
        <div className={styles.homePanel}>
          <div className={styles.homeMedia}>
            <Image
              src={image.src!}
              alt={image.alt[locale]}
              fill
              sizes="(min-width: 64rem) 45vw, 100vw"
              className={styles.categoryImg}
            />
            <span className={styles.mediaTag}>{common('illustrativeImage')}</span>
          </div>
          <div className={styles.homeText}>
            <span className={styles.homeEyebrow}>{t('homeServiceEyebrow')}</span>
            <h2 id="home-service-title">{t('homeServiceTitle')}</h2>
            <p className={styles.homeBody}>{t('homeServiceBody')}</p>
            <ol className={styles.homeSteps}>
              <li>{t('homeServiceStep1')}</li>
              <li>{t('homeServiceStep2')}</li>
              <li>{t('homeServiceStep3')}</li>
            </ol>
            <ButtonLink
              href={{ pathname: '/book', query: { place: 'home' } }}
              variant="inverse"
              size="lg"
            >
              {hero('bookHome')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function VisitSection({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SalonSettings;
}) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const address = settings.address?.[locale];
  return (
    <section className={`${styles.section} ${styles.band}`} aria-labelledby="visit-title">
      <div className={`container ${styles.visit}`}>
        <div className={styles.visitText}>
          <h2 id="visit-title">{t('visitTitle')}</h2>
          {address ? <p>{address}</p> : <p className={styles.muted}>{t('visitPending')}</p>}
        </div>
        <div className={styles.visitActions}>
          <ButtonLink href="/book" size="lg">
            {t('bookCta')}
          </ButtonLink>
          <ContactButtons settings={settings} locale={locale} />
        </div>
      </div>
    </section>
  );
}
