import { CATEGORY_IMAGES } from './media';
import type { BusinessHours, HomeServiceZone, Service } from './types';

/**
 * LOCAL PREVIEW DATA ONLY — every record is `isDemo: true`.
 * Names, prices, durations, zones and hours below are placeholders, not salon facts.
 * The production build refuses to run with DATA_SOURCE=demo (scripts/check-env.mjs).
 */

function demoService(
  n: number,
  categorySlug: Service['categorySlug'],
  categoryAr: string,
  categoryEn: string,
  overrides: Partial<Service> = {},
): Service {
  return {
    id: `demo-${categorySlug}-${n}`,
    slug: `demo-${categorySlug}-${n}`,
    categorySlug,
    name: { ar: `خدمة تجريبية ${n} — ${categoryAr}`, en: `Demo service ${n} — ${categoryEn}` },
    description: {
      ar: 'وصف تجريبي للمعاينة فقط، يُستبدل بالوصف المعتمد من الصالون.',
      en: 'Preview-only placeholder description, to be replaced with the approved text.',
    },
    durationMinutes: 60,
    priceMode: 'after_review',
    availableAtSalon: true,
    availableAtHome: false,
    consultationEnabled: false,
    published: true,
    isDemo: true,
    // Demo services borrow their section's illustrative image.
    image: CATEGORY_IMAGES[categorySlug],
    ...overrides,
  };
}

export const demoServices: Service[] = [
  demoService(1, 'facial', 'العناية بالوجه والبشرة', 'Facial', {
    priceMode: 'fixed',
    price: 100,
    availableAtHome: true,
  }),
  demoService(2, 'facial', 'العناية بالوجه والبشرة', 'Facial', { durationMinutes: 90 }),
  demoService(1, 'permanent-makeup', 'المكياج الدائم', 'Permanent Makeup', {
    durationMinutes: 120,
    consultationEnabled: true,
  }),
  demoService(1, 'hair', 'خدمات الشعر', 'Hair', { availableAtHome: true }),
  demoService(2, 'hair', 'خدمات الشعر', 'Hair', { published: false }),
  demoService(1, 'nails', 'خدمات الأظافر', 'Nails', {
    priceMode: 'fixed',
    price: 80,
    durationMinutes: 45,
    availableAtHome: true,
  }),
  // Henna intentionally has no published demo service, to preview the empty state.
];

export const demoZones: HomeServiceZone[] = [
  {
    id: 'demo-zone-a',
    name: { ar: 'منطقة تجريبية أ', en: 'Demo zone A' },
    visitFee: 50,
    active: true,
    isDemo: true,
  },
  {
    id: 'demo-zone-b',
    name: { ar: 'منطقة تجريبية ب', en: 'Demo zone B' },
    active: true,
    isDemo: true,
  },
];

/** Demo opening hours (Sun–Thu 10:00–20:00, Sat 12:00–20:00, Fri closed) — placeholders only. */
export const demoBusinessHours: BusinessHours[] = [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
  if (weekday === 5) return { weekday, closed: true, isDemo: true };
  if (weekday === 6) return { weekday, open: '12:00', close: '20:00', closed: false, isDemo: true };
  return { weekday, open: '10:00', close: '20:00', closed: false, isDemo: true };
});
