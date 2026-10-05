'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/lib/data/types';
import styles from './LocaleSwitcher.module.css';

/** Switches language on the same page. */
export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const target: Locale = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      href={pathname}
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
