import type { CategorySlug, ImageRef } from './types';

/**
 * Approved site imagery (2026-10-05). All photos are AI-generated illustrations supplied by the
 * salon: never present them as the salon's team, premises or finished work (kind: 'illustrative').
 */
const illustrative = (file: string, ar: string, en: string): ImageRef => ({
  src: `/images/soso/${file}`,
  kind: 'illustrative',
  alt: { ar, en },
});

export const SITE_IMAGES = {
  homeServiceHero: illustrative(
    'hero-home-service.webp',
    'خبيرة تجميل تقدّم خدمة لعميلة في غرفة جلوس منزلية',
    'A beautician attending to a client in a home living room',
  ),
  homeServiceKit: illustrative(
    'home-service-beauty-kit.webp',
    'حقيبة أدوات تجميل عنابية مفتوحة فيها فُرش ومستحضرات',
    'An open burgundy beauty kit with brushes and products',
  ),
  homeServiceManicure: illustrative(
    'home-service-manicure.webp',
    'خبيرة تعتني بأظافر عميلة في المنزل',
    'A specialist giving a client a manicure at home',
  ),
  salonInterior: illustrative(
    'salon-interior-illustration.webp',
    'صالون بمقاعد عنابية ومرايا مقوّسة بإطارات ذهبية',
    'A salon with burgundy chairs and arched gold-framed mirrors',
  ),
} as const;

export const CATEGORY_IMAGES: Record<CategorySlug, ImageRef> = {
  facial: illustrative(
    'service-facial.webp',
    'وضع قناع للعناية بالبشرة على وجه عميلة مسترخية',
    'A skincare mask being applied to a relaxed client',
  ),
  'permanent-makeup': illustrative(
    'service-permanent-makeup.webp',
    'خبيرة ترسم شكل الحاجب لعميلة قبل المكياج الدائم',
    'A specialist mapping a client’s brow for permanent makeup',
  ),
  hair: illustrative(
    'service-hair.webp',
    'تصفيف شعر طويل بالمجفف والفرشاة الدائرية',
    'Long hair being blow-dried with a round brush',
  ),
  nails: illustrative(
    'service-nails.webp',
    'طلاء أظافر بلون وردي هادئ',
    'Nails being painted in a soft pink polish',
  ),
  henna: illustrative(
    'service-henna.webp',
    'نقش حناء زهري على ظاهر اليد',
    'A floral henna design on the back of a hand',
  ),
};

/** Proportional 384px copy of the approved logo (master: assets/brand/logo-soso-original.png, 1254×1254, unaltered). */
export const LOGO = {
  src: '/images/soso/logo-soso-384.webp',
  width: 384,
  height: 384,
  alt: { ar: 'شعار سوسو – صالون نسائي', en: 'Soso Ladies Salon logo' },
} as const;
