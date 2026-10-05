import { intlLocale } from './format';
import type { Locale, Service } from './data/types';

export type PriceDisplay = { kind: 'fixed'; amount: number } | { kind: 'after_review' };

/** A service shows a number only when its price is fixed AND an amount was approved. */
export function getPriceDisplay(service: Pick<Service, 'priceMode' | 'price'>): PriceDisplay {
  if (service.priceMode === 'fixed' && typeof service.price === 'number' && service.price >= 0) {
    return { kind: 'fixed', amount: service.price };
  }
  return { kind: 'after_review' };
}

export function formatQar(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'QAR',
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Total is only defined when every component is known; otherwise the review screen
 * shows "price determined after review" instead of a made-up total.
 */
export function computeTotal(
  servicePrice: PriceDisplay,
  visitFee: number | undefined,
  isHome: boolean,
) {
  if (servicePrice.kind !== 'fixed') return undefined;
  if (!isHome) return servicePrice.amount;
  if (typeof visitFee !== 'number') return undefined;
  return servicePrice.amount + visitFee;
}
