import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SITE } from '@/lib/data/site';
import type { Locale } from '@/lib/data/types';
import { buildTelLink, buildWhatsAppLink, formatPhoneDisplay } from '@/lib/whatsapp';
import styles from './ContactButtons.module.css';

/** "Call us" and "WhatsApp" buttons, each bound to its own approved number. */
export async function ContactButtons({
  locale,
  showNumbers = false,
}: {
  locale: Locale;
  showNumbers?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  const wa = await getTranslations({ locale, namespace: 'wa' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const tel = buildTelLink(SITE.phone);
  const whatsapp = buildWhatsAppLink(SITE.whatsapp, wa('general'));

  return (
    <>
      {tel && (
        <a href={tel} className={buttonClass({ variant: 'secondary', size: 'lg' }, styles.button)}>
          <Icon name="phone" size={20} />
          <span className={styles.label}>
            {t('call')}
            {showNumbers && (
              <bdi dir="ltr" className={styles.number}>
                {formatPhoneDisplay(SITE.phone)}
              </bdi>
            )}
          </span>
        </a>
      )}
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass({ variant: 'secondary', size: 'lg' }, styles.button)}
        >
          <Icon name="whatsapp" size={20} />
          <span className={styles.label}>
            {t('whatsapp')}
            {showNumbers && (
              <bdi dir="ltr" className={styles.number}>
                {formatPhoneDisplay(SITE.whatsapp)}
              </bdi>
            )}
          </span>
          <span className="visually-hidden">{common('opensWhatsapp')}</span>
        </a>
      )}
    </>
  );
}
