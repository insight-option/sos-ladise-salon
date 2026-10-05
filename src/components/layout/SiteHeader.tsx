'use client';

import Image from 'next/image';
import { Suspense, useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { buttonClass } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link, usePathname } from '@/i18n/navigation';
import { LOGO } from '@/lib/data/media';
import { SITE } from '@/lib/data/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/services', key: 'services' },
  { href: '/home-service', key: 'homeService' },
  { href: '/contact', key: 'contact' },
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const wa = useTranslations('wa');
  const common = useTranslations('common');
  const pathname = usePathname();
  // The menu is open "for" a pathname, so navigating anywhere closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const panelId = useId();
  const bookHref = buildWhatsAppLink(SITE.whatsapp, wa('salon'));

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const links = () =>
    NAV.map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          className={styles.navLink}
          aria-current={isCurrent(item.href) ? 'page' : undefined}
        >
          {t(item.key)}
        </Link>
      </li>
    ));

  const bookLink = (extra: string | undefined, block = false) =>
    bookHref && (
      <a
        href={bookHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass({ size: block ? 'lg' : 'md', block }, extra)}
      >
        <Icon name="whatsapp" size={18} />
        {t('book')}
        <span className="visually-hidden">{common('opensWhatsapp')}</span>
      </a>
    );

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label={t('logoLabel')}>
          {/* Approved logo, unaltered; it has a white background, so the header is white too. */}
          <Image
            src={LOGO.src}
            alt=""
            width={LOGO.width}
            height={LOGO.height}
            sizes="80px"
            priority
            className={styles.logo}
          />
        </Link>

        <nav className={styles.nav} aria-label={t('label')}>
          <ul className={styles.navList}>{links()}</ul>
        </nav>

        <div className={styles.actions}>
          <Suspense fallback={null}>
            <LocaleSwitcher />
          </Suspense>
          {bookLink(styles.bookDesktop)}
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
        {bookLink('', true)}
      </div>
    </header>
  );
}
