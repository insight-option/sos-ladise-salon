import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export function Badge({
  tone = 'blush',
  dot = false,
  children,
}: {
  tone?: 'blush' | 'pending' | 'demo';
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
