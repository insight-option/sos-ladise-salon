import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/data/types';

/** Shown on every page while the site runs on demo data (spec §2.4). */
export async function DemoBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'demo' });
  return (
    <div
      role="note"
      style={{
        background: 'var(--status-pending-bg)',
        color: 'var(--status-pending-fg)',
        borderBottom: '1px dashed var(--status-pending-fg)',
        fontSize: 'var(--text-small)',
        fontWeight: 600,
        textAlign: 'center',
        padding: 'var(--space-2) var(--gutter)',
      }}
    >
      {t('banner')}
    </div>
  );
}
