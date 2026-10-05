'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/lib/data/types';
import styles from './LocaleSwitcher.module.css';

/**
 * Switches language on the same page, keeping the query string.
 * The booking draft lives in localStorage, so it survives the switch too.
 */
export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const target: Locale = locale === 'ar' ? 'en' : 'ar';
  const query = Object.fromEntries(searchParams.entries());

  return (
    <Link
      href={{ pathname, query }}
      locale={target}
      lang={target}
      hrefLang={target}
      className={styles.switcher}
      aria-label={t('switchLanguageLabel')}
    >
      {t('switchLanguage')}
    </Link>
  );
}
