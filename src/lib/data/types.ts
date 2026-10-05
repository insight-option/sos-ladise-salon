/** Domain types for the showcase site (no booking, accounts or database). */

export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export type Localized = Record<Locale, string>;

export const CATEGORY_SLUGS = ['facial', 'permanent-makeup', 'hair', 'nails', 'henna'] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/** `real` = approved photo of the salon's work, `illustrative` = generated/stock visual. */
export type ImageKind = 'real' | 'illustrative';

export interface ImageRef {
  src: string;
  alt: Localized;
  kind: ImageKind;
}

export interface Category {
  slug: CategorySlug;
  name: Localized;
  order: number;
  image: ImageRef;
}

export interface SalonSettings {
  name: Localized;
  /** Local 8-digit Qatari numbers. */
  phone: string;
  whatsapp: string;
}
