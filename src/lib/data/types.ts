/**
 * Domain types shared by the UI and the data layer.
 * Phase 1 serves these from local demo data; Phase 2 maps them onto the Amplify Data models.
 */

export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export type Localized = Record<Locale, string>;

export const CATEGORY_SLUGS = ['facial', 'permanent-makeup', 'hair', 'nails', 'henna'] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/** `real` = approved photo of the salon's work, `illustrative` = stock/prepared visual, `missing` = not provided yet. */
export type ImageKind = 'real' | 'illustrative' | 'missing';

export interface ImageRef {
  src?: string;
  alt: Localized;
  kind: ImageKind;
}

export interface Category {
  slug: CategorySlug;
  name: Localized;
  order: number;
  image?: ImageRef;
}

export type PriceMode = 'fixed' | 'after_review';

export interface Service {
  id: string;
  slug: string;
  categorySlug: CategorySlug;
  name: Localized;
  description: Localized;
  durationMinutes?: number;
  /** Price in QAR; only meaningful when `priceMode` is `fixed`. */
  price?: number;
  priceMode: PriceMode;
  availableAtSalon: boolean;
  availableAtHome: boolean;
  preparation?: Localized;
  aftercare?: Localized;
  consultationEnabled: boolean;
  published: boolean;
  isDemo: boolean;
  image?: ImageRef;
}

export interface HomeServiceZone {
  id: string;
  name: Localized;
  /** Visit fee in QAR; undefined until approved. */
  visitFee?: number;
  active: boolean;
  isDemo: boolean;
}

export interface BusinessHours {
  /** 0 = Sunday … 6 = Saturday, in Asia/Qatar. */
  weekday: number;
  open?: string;
  close?: string;
  closed: boolean;
  isDemo: boolean;
}

export interface SalonSettings {
  name: Localized;
  phone?: string;
  whatsapp?: string;
  address?: Localized;
  coordinates?: { lat: number; lng: number };
  timeZone: 'Asia/Qatar';
  currency: 'QAR';
  /** Minutes added before/after home visits; undefined until approved (A4). */
  homeTravelMinutes?: number;
  pendingRequestsBlockSlots: boolean;
  staffSelectionEnabled: boolean;
}

export type ServicePlace = 'salon' | 'home';
