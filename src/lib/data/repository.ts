import { CATEGORIES } from './categories';
import { demoBusinessHours, demoServices, demoZones } from './demo-data';
import type {
  BusinessHours,
  Category,
  CategorySlug,
  HomeServiceZone,
  SalonSettings,
  Service,
  ServicePlace,
} from './types';

export interface ContentRepository {
  /** True when any data served comes from local demo records. */
  readonly isDemo: boolean;
  getSettings(): Promise<SalonSettings>;
  getCategories(): Promise<readonly Category[]>;
  getServices(filter?: { category?: CategorySlug; place?: ServicePlace }): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getActiveZones(): Promise<HomeServiceZone[]>;
  getBusinessHours(): Promise<BusinessHours[]>;
}

/** Settings that are confirmed or safe defaults. Contact fields stay empty until approved. */
export const BASE_SETTINGS: SalonSettings = {
  name: { ar: 'سوسو – صالون نسائي', en: 'Soso Ladies Salon' },
  timeZone: 'Asia/Qatar',
  currency: 'QAR',
  pendingRequestsBlockSlots: false,
  staffSelectionEnabled: false,
};

export function filterServices(
  services: readonly Service[],
  filter: { category?: CategorySlug; place?: ServicePlace } = {},
): Service[] {
  return services.filter((s) => {
    if (!s.published) return false;
    if (filter.category && s.categorySlug !== filter.category) return false;
    if (filter.place === 'salon' && !s.availableAtSalon) return false;
    if (filter.place === 'home' && !s.availableAtHome) return false;
    return true;
  });
}

export function createDemoRepository(): ContentRepository {
  return {
    isDemo: true,
    getSettings: async () => BASE_SETTINGS,
    getCategories: async () => CATEGORIES,
    getServices: async (filter) => filterServices(demoServices, filter),
    getServiceBySlug: async (slug) => demoServices.find((s) => s.published && s.slug === slug),
    getActiveZones: async () => demoZones.filter((z) => z.active),
    getBusinessHours: async () => demoBusinessHours,
  };
}

/** Empty repository: what the site looks like with no approved operational data. */
export function createEmptyRepository(): ContentRepository {
  return {
    isDemo: false,
    getSettings: async () => BASE_SETTINGS,
    getCategories: async () => CATEGORIES,
    getServices: async () => [],
    getServiceBySlug: async () => undefined,
    getActiveZones: async () => [],
    getBusinessHours: async () => [],
  };
}

export function getRepository(): ContentRepository {
  const source = process.env.DATA_SOURCE ?? 'demo';
  switch (source) {
    case 'demo':
      return createDemoRepository();
    case 'empty':
      return createEmptyRepository();
    case 'amplify':
      throw new Error('DATA_SOURCE=amplify is implemented in Phase 2.');
    default:
      throw new Error(`Unknown DATA_SOURCE "${source}".`);
  }
}
