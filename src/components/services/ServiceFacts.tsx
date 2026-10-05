import { getTranslations } from 'next-intl/server';
import type { Locale, Service } from '@/lib/data/types';
import { formatNumber } from '@/lib/format';
import { formatQar, getPriceDisplay } from '@/lib/pricing';
import styles from './ServiceCard.module.css';

/** Duration + price; shows the approved wording instead of a number when price is not fixed. */
export async function ServiceFacts({ service, locale }: { service: Service; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'services' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const price = getPriceDisplay(service);
  return (
    <dl className={styles.facts}>
      <div>
        <dt>{t('duration')}:</dt>
        <dd>
          {service.durationMinutes
            ? common('minutes', { count: formatNumber(service.durationMinutes, locale) })
            : common('durationUnknown')}
        </dd>
      </div>
      <div>
        <dt>{t('price')}:</dt>
        <dd className={price.kind === 'after_review' ? styles.pending : undefined}>
          {price.kind === 'fixed' ? formatQar(price.amount, locale) : common('priceAfterReview')}
        </dd>
      </div>
    </dl>
  );
}
