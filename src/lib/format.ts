import type { Locale } from './data/types';

/**
 * One Intl locale per site language so digits, dates and currency always match.
 * Latin digits in both languages (approved 2026-10-05): `-u-nu-latn` overrides ar-QA's Arabic-Indic default.
 */
export const intlLocale = (locale: Locale) => (locale === 'ar' ? 'ar-QA-u-nu-latn' : 'en-QA');

export const formatNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(intlLocale(locale)).format(value);
