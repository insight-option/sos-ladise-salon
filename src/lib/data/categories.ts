import { CATEGORY_IMAGES } from './media';
import type { Category } from './types';

/** The five confirmed sections (spec §2.1), with the approved illustrative images. */
export const CATEGORIES: readonly Category[] = [
  {
    slug: 'facial',
    order: 1,
    name: { ar: 'العناية بالوجه والبشرة', en: 'Facial' },
    image: CATEGORY_IMAGES.facial,
  },
  {
    slug: 'permanent-makeup',
    order: 2,
    name: { ar: 'المكياج الدائم', en: 'Permanent Makeup' },
    image: CATEGORY_IMAGES['permanent-makeup'],
  },
  { slug: 'hair', order: 3, name: { ar: 'خدمات الشعر', en: 'Hair' }, image: CATEGORY_IMAGES.hair },
  {
    slug: 'nails',
    order: 4,
    name: { ar: 'خدمات الأظافر', en: 'Nails' },
    image: CATEGORY_IMAGES.nails,
  },
  { slug: 'henna', order: 5, name: { ar: 'الحناء', en: 'Henna' }, image: CATEGORY_IMAGES.henna },
];
