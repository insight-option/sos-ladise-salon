import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { ImageRef, Locale } from '@/lib/data/types';
import styles from './ServiceImage.module.css';

/**
 * Renders an approved image, an illustrative one (tagged as such), or a labelled placeholder.
 * Illustrative images are never presented as the salon's own work (spec §4.5).
 */
export async function ServiceImage({
  image,
  locale,
  aspect = '4 / 3',
  sizes = '(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw',
  className,
}: {
  image?: ImageRef;
  locale: Locale;
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'common' });
  const frameClass = [styles.frame, className].filter(Boolean).join(' ');

  if (!image?.src || image.kind === 'missing') {
    return (
      <div className={frameClass} style={{ aspectRatio: aspect }}>
        <div className={styles.placeholder}>
          <span className={styles.label}>{t('imagePending')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass} style={{ aspectRatio: aspect }}>
      <Image src={image.src} alt={image.alt[locale]} fill sizes={sizes} className={styles.img} />
      {image.kind === 'illustrative' && (
        <span className={styles.tag}>{t('illustrativeImage')}</span>
      )}
    </div>
  );
}
