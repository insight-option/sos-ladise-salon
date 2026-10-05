import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { buttonClass, type ButtonVariant } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SITE } from '@/lib/data/site';
import type { Locale } from '@/lib/data/types';
import { buildWhatsAppLink } from '@/lib/whatsapp';

/**
 * Booking and enquiries happen on WhatsApp (no online booking). The chat opens with a
 * prefilled message so the salon knows what the visitor wants.
 */
export async function WhatsAppButton({
  locale,
  message,
  children,
  variant = 'primary',
  size = 'md',
  block,
  className,
}: {
  locale: Locale;
  message: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  block?: boolean;
  className?: string;
}) {
  const href = buildWhatsAppLink(SITE.whatsapp, message);
  if (!href) return null;
  const t = await getTranslations({ locale, namespace: 'common' });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass({ variant, size, block }, className)}
    >
      <Icon name="whatsapp" size={20} />
      {children}
      <span className="visually-hidden">{t('opensWhatsapp')}</span>
    </a>
  );
}
