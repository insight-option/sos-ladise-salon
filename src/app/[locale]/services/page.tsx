import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { SITE_IMAGES } from '@/lib/data/media';
import { getRepository } from '@/lib/data/repository';
import type { ServicePlace } from '@/lib/data/types';
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

function parsePlace(value: string | string[] | undefined): ServicePlace | undefined {
  return value === 'salon' || value === 'home' ? value : undefined;
}

export default async function ServicesPage({
  params,
  searchParams,
}: PageProps<'/[locale]/services'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const place = parsePlace((await searchParams).place);
  const t = await getTranslations({ locale, namespace: 'services' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  const repo = getRepository();
  const [categories, services] = await Promise.all([
    repo.getCategories(),
    repo.getServices({ place }),
  ]);

  const filters: { value?: ServicePlace; label: string }[] = [
    { label: t('placeAll') },
    { value: 'salon', label: common('atSalon') },
    { value: 'home', label: common('atHome') },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.intro}>
        <div className={styles.banner}>
          <Image
            src={SITE_IMAGES.salonInterior.src!}
            alt={SITE_IMAGES.salonInterior.alt[locale]}
            fill
            priority
            sizes="(min-width: 77.5rem) 1240px, 100vw"
            className={styles.bannerImg}
          />
          <h1>{t('title')}</h1>
        </div>
        <p className={styles.note}>{common('illustrativeNote')}</p>
        <div className={styles.filters}>
          <nav aria-label={t('placeFilterLabel')}>
            <ul className={styles.segmented}>
              {filters.map((f) => (
                <li key={f.label}>
                  <Link
                    href={
                      f.value ? { pathname: '/services', query: { place: f.value } } : '/services'
                    }
                    className={styles.segment}
                    aria-current={place === f.value ? 'true' : undefined}
                    scroll={false}
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t('categoriesNav')}>
            <ul className={styles.chips}>
              {categories.map((c) => (
                <li key={c.slug}>
                  <a href={`#${c.slug}`} className={styles.chip}>
                    {c.name[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {categories.map((category) => {
        const inCategory = services.filter((s) => s.categorySlug === category.slug);
        return (
          <section
            key={category.slug}
            id={category.slug}
            className={styles.category}
            aria-labelledby={`h-${category.slug}`}
          >
            <h2 id={`h-${category.slug}`}>{category.name[locale]}</h2>
            {inCategory.length > 0 ? (
              <ul className={styles.grid}>
                {inCategory.map((s) => (
                  <li key={s.id}>
                    <ServiceCard service={s} locale={locale} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>
                <Icon name={category.slug} size={32} />
                <div className={styles.emptyText}>
                  <strong>{t('empty')}</strong>
                  <span className={styles.muted}>{t('emptyHint')}</span>
                </div>
                <ButtonLink href="/contact" variant="secondary">
                  {nav('contact')}
                </ButtonLink>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
