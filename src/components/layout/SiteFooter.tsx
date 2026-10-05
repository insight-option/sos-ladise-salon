import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LOGO } from '@/lib/data/media';
import { getRepository } from '@/lib/data/repository';
import type { Locale } from '@/lib/data/types';
import { buildTelLink, buildWhatsAppLink, formatPhoneDisplay } from '@/lib/whatsapp';
import styles from './SiteFooter.module.css';

/** Privacy/terms links are omitted until their approved text is published (spec §4.7). */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const contact = await getTranslations({ locale, namespace: 'contact' });
  const settings = await getRepository().getSettings();
  const tel = buildTelLink(settings.phone);
  const whatsapp = buildWhatsAppLink(settings.whatsapp);

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
                <bdi dir="ltr">{formatPhoneDisplay(settings.phone)}</bdi>
              </a>
            </li>
          )}
          {whatsapp && (
            <li>
              <span className={styles.label}>{contact('whatsappLabel')}</span>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <bdi dir="ltr">{formatPhoneDisplay(settings.whatsapp)}</bdi>
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
