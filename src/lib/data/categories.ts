import type { Category } from './types';

/** The five confirmed sections (spec §2.1). Names are approved; images are pending. */
export const CATEGORIES: readonly Category[] = [
  { slug: 'facial', order: 1, name: { ar: 'العناية بالوجه والبشرة', en: 'Facial' } },
  { slug: 'permanent-makeup', order: 2, name: { ar: 'المكياج الدائم', en: 'Permanent Makeup' } },
  { slug: 'hair', order: 3, name: { ar: 'خدمات الشعر', en: 'Hair' } },
  { slug: 'nails', order: 4, name: { ar: 'خدمات الأظافر', en: 'Nails' } },
  { slug: 'henna', order: 5, name: { ar: 'الحناء', en: 'Henna' } },
];
