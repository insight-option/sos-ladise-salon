import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LOGO } from '@/lib/data/media';
import { SITE } from '@/lib/data/site';
import type { Locale } from '@/lib/data/types';
import { buildTelLink, buildWhatsAppLink, formatPhoneDisplay } from '@/lib/whatsapp';
import styles from './SiteFooter.module.css';

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const contact = await getTranslations({ locale, namespace: 'contact' });
  const wa = await getTranslations({ locale, namespace: 'wa' });
  const tel = buildTelLink(SITE.phone);
  const whatsapp = buildWhatsAppLink(SITE.whatsapp, wa('general'));

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* The logo keeps its own white background, shown on a white tile. */}
        <span className={styles.logoTile}>
          <Image
            src={LOGO.src}
            alt={LOGO.alt[locale]}
            width={LOGO.width}
            height={LOGO.height}
            sizes="128px"
            className={styles.logo}
          />
        </span>
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
        <ul className={styles.contact}>
          {tel && (
            <li>
              <span className={styles.label}>{contact('phoneLabel')}</span>
              <a href={tel}>
                <bdi dir="ltr">{formatPhoneDisplay(SITE.phone)}</bdi>
              </a>
            </li>
          )}
          {whatsapp && (
            <li>
              <span className={styles.label}>{contact('whatsappLabel')}</span>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <bdi dir="ltr">{formatPhoneDisplay(SITE.whatsapp)}</bdi>
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
