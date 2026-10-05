import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import type { Locale } from '@/lib/data/types';
import { HeroVideo } from './HeroVideo';
import styles from './Hero.module.css';

export const HERO_MEDIA = {
  video: '/media/hero.mp4',
  poster: '/media/hero-poster.jpg',
} as const;

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'hero' });
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
          <ButtonLink href={{ pathname: '/book', query: { place: 'salon' } }} size="lg">
            {t('bookSalon')}
          </ButtonLink>
          <ButtonLink
            href={{ pathname: '/book', query: { place: 'home' } }}
            size="lg"
            variant="onDark"
          >
            {t('bookHome')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
