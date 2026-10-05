import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PlaceBadges } from '@/components/services/ServiceCard';
import { ServiceFacts } from '@/components/services/ServiceFacts';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ServiceImage } from '@/components/ui/ServiceImage';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getRepository } from '@/lib/data/repository';
import { pageMetadata } from '@/lib/seo';
import styles from './detail.module.css';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const service = await getRepository().getServiceBySlug(slug);
  if (!service) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.name[locale],
    description: service.description[locale],
    siteName: t('siteName'),
    noindex: service.isDemo,
  });
}

export default async function ServiceDetailPage({
  params,
}: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const service = await getRepository().getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: 'service' });
  const s = await getTranslations({ locale, namespace: 'services' });
  const bookPlace = service.availableAtSalon ? 'salon' : 'home';

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/services" className={styles.back}>
        <Icon name="arrow" size={18} directional className={styles.backIcon} />
        {t('backToServices')}
      </Link>
      <div className={styles.layout}>
        <ServiceImage
          image={service.image}
          locale={locale}
          aspect="4 / 3"
          sizes="(min-width: 64rem) 50vw, 100vw"
          className={styles.image}
        />
        <div className={styles.content}>
          <PlaceBadges service={service} locale={locale} />
          <h1>{service.name[locale]}</h1>
          <p className={styles.description}>{service.description[locale]}</p>
          <ServiceFacts service={service} locale={locale} />
          <div className={styles.actions}>
            <ButtonLink
              href={{ pathname: '/book', query: { place: bookPlace, service: service.slug } }}
              size="lg"
            >
              {t('bookThis')}
            </ButtonLink>
            {service.consultationEnabled && (
              <ButtonLink href="/contact" variant="solid" size="lg">
                {s('requestConsultation')}
              </ButtonLink>
            )}
          </div>
          {service.preparation && (
            <section className={styles.note}>
              <h2>{t('preparation')}</h2>
              <p>{service.preparation[locale]}</p>
            </section>
          )}
          {service.aftercare && (
            <section className={styles.note}>
              <h2>{t('aftercare')}</h2>
              <p>{service.aftercare[locale]}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
