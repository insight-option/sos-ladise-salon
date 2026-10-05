import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { Icon } from '@/components/ui/Icon';
import { routing } from '@/i18n/routing';
import { getRepository } from '@/lib/data/repository';
import { pageMetadata } from '@/lib/seo';
import { buildTelLink, buildWhatsAppLink, formatPhoneDisplay } from '@/lib/whatsapp';
import styles from './contact.module.css';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/contact',
    title: t('contactTitle'),
    description: t('contactDescription'),
    siteName: t('siteName'),
  });
}

/** Address, hours and map stay hidden behind "to be announced" until approved (spec §4.6). */
export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });
  const settings = await getRepository().getSettings();
  const tel = buildTelLink(settings.phone);
  const whatsapp = buildWhatsAppLink(settings.whatsapp);
  const address = settings.address?.[locale];

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.intro}>
        <h1>{t('title')}</h1>
        <p>{t('intro')}</p>
      </div>

      <div className={styles.actions}>
        <ContactButtons settings={settings} locale={locale} showNumbers />
      </div>

      <dl className={styles.details}>
        {tel && (
          <div>
            <dt>
              <Icon name="phone" size={20} />
              {t('phoneLabel')}
            </dt>
            <dd>
              <a href={tel}>
                <bdi dir="ltr">{formatPhoneDisplay(settings.phone)}</bdi>
              </a>
            </dd>
          </div>
        )}
        {whatsapp && (
          <div>
            <dt>
              <Icon name="whatsapp" size={20} />
              {t('whatsappLabel')}
            </dt>
            <dd>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <bdi dir="ltr">{formatPhoneDisplay(settings.whatsapp)}</bdi>
              </a>
            </dd>
          </div>
        )}
        <div>
          <dt>
            <Icon name="pin" size={20} />
            {t('addressLabel')}
          </dt>
          <dd className={address ? undefined : styles.pending}>{address ?? t('pending')}</dd>
        </div>
        <div>
          <dt>
            <Icon name="clock" size={20} />
            {t('hoursLabel')}
          </dt>
          <dd className={styles.pending}>{t('pending')}</dd>
        </div>
      </dl>
    </div>
  );
}
