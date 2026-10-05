import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Locale, SalonSettings } from '@/lib/data/types';
import { buildTelLink, buildWhatsAppLink, formatPhoneDisplay } from '@/lib/whatsapp';
import styles from './ContactButtons.module.css';

/**
 * "Call us" and "WhatsApp" buttons, each bound to its own approved number.
 * A button is omitted when its number is not configured.
 */
export async function ContactButtons({
  settings,
  locale,
  showNumbers = false,
}: {
  settings: SalonSettings;
  locale: Locale;
  showNumbers?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tel = buildTelLink(settings.phone);
  const whatsapp = buildWhatsAppLink(settings.whatsapp);
  const phoneText = formatPhoneDisplay(settings.phone);
  const whatsappText = formatPhoneDisplay(settings.whatsapp);

  return (
    <>
      {tel && (
        <a href={tel} className={buttonClass({ variant: 'secondary', size: 'lg' }, styles.button)}>
          <Icon name="phone" size={20} />
          <span className={styles.label}>
            {t('call')}
            {showNumbers && phoneText && (
              <bdi dir="ltr" className={styles.number}>
                {phoneText}
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
            {showNumbers && whatsappText && (
              <bdi dir="ltr" className={styles.number}>
                {whatsappText}
              </bdi>
            )}
          </span>
        </a>
      )}
    </>
  );
}
