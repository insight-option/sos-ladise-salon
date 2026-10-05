import type { Locale } from './data/types';

/** One Intl locale per site language so digits, dates and currency always match (ar-QA → Arabic-Indic). */
export const intlLocale = (locale: Locale) => (locale === 'ar' ? 'ar-QA' : 'en-QA');

export const formatNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale(locale)).format(value);
