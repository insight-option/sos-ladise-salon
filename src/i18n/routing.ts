import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '@/lib/data/types';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export const DIRECTION = { ar: 'rtl', en: 'ltr' } as const;
