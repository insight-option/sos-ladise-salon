'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import styles from './Hero.module.css';

/**
 * Muted, looping background video with a poster fallback.
 * - Never autoplays when the visitor prefers reduced motion.
 * - Always offers a pause/play control (WCAG 2.2.2 for motion longer than 5s).
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const t = useTranslations('hero');
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduce.matches) {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false), // autoplay blocked: poster stays, button offers play
      );
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        video.pause();
        setPlaying(false);
      }
    };
    reduce.addEventListener('change', onChange);
    return () => reduce.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={styles.video}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        className={styles.videoToggle}
        onClick={toggle}
        aria-pressed={!playing}
        aria-label={playing ? t('pauseVideo') : t('playVideo')}
      >
        <Icon name={playing ? 'pause' : 'play'} size={20} />
      </button>
    </>
  );
}
