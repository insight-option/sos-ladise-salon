import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { ServiceImage } from '@/components/ui/ServiceImage';
import type { Locale, Service } from '@/lib/data/types';
import { ServiceFacts } from './ServiceFacts';
import styles from './ServiceCard.module.css';

export async function PlaceBadges({ service, locale }: { service: Service; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const demo = await getTranslations({ locale, namespace: 'demo' });
  return (
    <div className={styles.badges}>
      {service.availableAtSalon && <Badge>{t('atSalon')}</Badge>}
      {service.availableAtHome && <Badge>{t('atHome')}</Badge>}
      {service.isDemo && <Badge tone="demo">{demo('badge')}</Badge>}
    </div>
  );
}

export async function ServiceCard({ service, locale }: { service: Service; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const bookPlace = service.availableAtSalon ? 'salon' : 'home';
  return (
    <article className={styles.card}>
      <ServiceImage image={service.image} locale={locale} showTag={false} />
      <div className={styles.body}>
        <PlaceBadges service={service} locale={locale} />
        <h3 className={styles.name}>{service.name[locale]}</h3>
        <p className={styles.description}>{service.description[locale]}</p>
        <ServiceFacts service={service} locale={locale} />
        <div className={styles.actions}>
          <ButtonLink href={`/services/${service.slug}`} variant="secondary">
            {t('details')}
          </ButtonLink>
          <ButtonLink
            href={{ pathname: '/book', query: { place: bookPlace, service: service.slug } }}
          >
            {t('book')}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
