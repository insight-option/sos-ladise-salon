'use client';

import { Suspense, useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/services', key: 'services' },
  { href: '/home-service', key: 'homeService' },
  { href: '/gallery', key: 'gallery' },
  { href: '/contact', key: 'contact' },
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const tMeta = useTranslations('meta');
  const pathname = usePathname();
  // The menu is open "for" a pathname, so navigating anywhere closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const panelId = useId();

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const links = (className?: string) =>
    NAV.map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          className={[styles.navLink, className].filter(Boolean).join(' ')}
          aria-current={isCurrent(item.href) ? 'page' : undefined}
        >
          {t(item.key)}
        </Link>
      </li>
    ));

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label={tMeta('siteName')}>
          {/* Text wordmark until the final logo is approved (open question Q1). */}
          <span className={styles.brandName}>{tMeta('brandName')}</span>
          <span className={styles.brandSub} aria-hidden="true">
            {tMeta('brandTagline')}
          </span>
        </Link>

        <nav className={styles.nav} aria-label={t('label')}>
          <ul className={styles.navList}>{links()}</ul>
        </nav>

        <div className={styles.actions}>
          <Suspense fallback={null}>
            <LocaleSwitcher />
          </Suspense>
          <Link href="/login" className={styles.iconButton} aria-label={t('account')}>
            <Icon name="user" size={22} />
          </Link>
          <ButtonLink href="/book" className={styles.bookDesktop}>
            {t('book')}
          </ButtonLink>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <div id={panelId} className={`container ${styles.mobilePanel}`} hidden={!open}>
        <nav aria-label={t('label')}>
          <ul className={styles.mobileList}>{links()}</ul>
        </nav>
        <ButtonLink href="/book" size="lg" block>
          {t('book')}
        </ButtonLink>
      </div>
    </header>
  );
}
