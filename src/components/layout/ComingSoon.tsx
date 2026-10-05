import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import type { Locale } from '@/lib/data/types';
import { pageMetadata } from '@/lib/seo';

/** Placeholder for routes scheduled in later phases, so navigation never leads to a 404. */
export async function ComingSoon({ locale, heading }: { locale: Locale; heading: string }) {
  const t = await getTranslations({ locale, namespace: 'comingSoon' });
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        paddingBlock: 'var(--space-18)',
        maxWidth: '44rem',
      }}
    >
      <h1 style={{ fontSize: 'var(--text-h2)' }}>{heading}</h1>
      <p style={{ color: 'var(--color-muted)' }}>{t('body')}</p>
      <ButtonLink href="/" variant="secondary">
        {t('backHome')}
      </ButtonLink>
    </div>
  );
}

export async function comingSoonMetadata(
  locale: Locale,
  path: string,
  heading: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale, path, title: heading, siteName: t('siteName'), noindex: true });
}
