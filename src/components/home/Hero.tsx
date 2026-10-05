import { getTranslations } from 'next-intl/server';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import type { Locale } from '@/lib/data/types';
import { HeroVideo } from './HeroVideo';
import styles from './Hero.module.css';

export const HERO_MEDIA = {
  video: '/media/hero.mp4',
  poster: '/media/hero-poster.jpg',
} as const;

/** The two approved booking buttons open WhatsApp with a matching prefilled message. */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const wa = await getTranslations({ locale, namespace: 'wa' });
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroVideo src={HERO_MEDIA.video} poster={HERO_MEDIA.poster} />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        <span className={styles.eyebrow}>{t('eyebrow')}</span>
        <h1 id="hero-title" className={styles.title}>
          {t('title')}
        </h1>
        <div className={styles.actions}>
          <WhatsAppButton locale={locale} message={wa('salon')} size="lg">
            {t('bookSalon')}
          </WhatsAppButton>
          <WhatsAppButton locale={locale} message={wa('home')} size="lg" variant="onDark">
            {t('bookHome')}
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
