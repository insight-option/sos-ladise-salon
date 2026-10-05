import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/lib/data/types';
import styles from './SiteFooter.module.css';

/** Privacy/terms links are omitted until their approved text is published (spec §4.7). */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const meta = await getTranslations({ locale, namespace: 'meta' });
  const other: Locale = locale === 'ar' ? 'en' : 'ar';
  const otherMeta = await getTranslations({ locale: other, namespace: 'meta' });

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.name}>{meta('siteName')}</span>
          <span lang={other} className={styles.alt}>
            {otherMeta('siteName')}
          </span>
        </div>
        <nav aria-label={t('label')}>
          <ul className={styles.links}>
            <li>
              <Link href="/services">{nav('services')}</Link>
            </li>
            <li>
              <Link href="/home-service">{nav('homeService')}</Link>
            </li>
            <li>
              <Link href="/contact">{nav('contact')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
