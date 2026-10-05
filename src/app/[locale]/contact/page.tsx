import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactButtons } from '@/components/contact/ContactButtons';
import { Icon } from '@/components/ui/Icon';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/data/site';
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

/** Contact shows only the approved call and WhatsApp numbers (owner decision 2026-10-05). */
export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });
  const wa = await getTranslations({ locale, namespace: 'wa' });
  const tel = buildTelLink(SITE.phone);
  const whatsapp = buildWhatsAppLink(SITE.whatsapp, wa('general'));

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.intro}>
        <h1>{t('title')}</h1>
        <p>{t('intro')}</p>
      </div>

      <div className={styles.actions}>
        <ContactButtons locale={locale} showNumbers />
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
                <bdi dir="ltr">{formatPhoneDisplay(SITE.phone)}</bdi>
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
                <bdi dir="ltr">{formatPhoneDisplay(SITE.whatsapp)}</bdi>
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
