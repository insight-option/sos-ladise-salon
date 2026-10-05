import { describe, expect, it } from 'vitest';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';
import { CATEGORIES } from './data/categories';
import { demoBusinessHours, demoServices, demoZones } from './data/demo-data';
import { createEmptyRepository, filterServices } from './data/repository';
import { computeTotal, getPriceDisplay } from './pricing';
import { isValidQatarPhone } from './phone';
import { buildWhatsAppLink } from './whatsapp';
import { checkEnv } from '../../scripts/check-env.mjs';

describe('phone validation', () => {
  it('accepts common ways of typing a Qatari mobile number', () => {
    for (const ok of [
      '55551234',
      '5555 1234',
      '+974 5555 1234',
      '+97455551234',
      '00974-5555-1234',
    ]) {
      expect(isValidQatarPhone(ok), ok).toBe(true);
    }
  });
  it('rejects incomplete or non-numeric input', () => {
    for (const bad of ['', '5555123', '+974 5555 12345', 'abcdefgh', '+1 555 555 1234']) {
      expect(isValidQatarPhone(bad), bad).toBe(false);
    }
  });
});

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('translations', () => {
  it('Arabic and English define exactly the same keys', () => {
    expect(keys(ar).sort()).toEqual(keys(en).sort());
  });

  it('uses the approved Arabic copy verbatim', () => {
    expect(ar.hero.title).toBe('جمالك وراحتك… في الصالون أو في بيتك');
    expect(ar.hero.bookSalon).toBe('احجزي في الصالون');
    expect(ar.hero.bookHome).toBe('اطلبي خدمة منزلية');
    expect(ar.book.receivedTitle).toBe('تم استلام طلب حجزك، وسنؤكد الموعد بعد مراجعة التوفر');
    expect(ar.common.priceAfterReview).toBe('السعر يُحدَّد بعد المراجعة');
  });

  it('never claims a booking is confirmed', () => {
    expect(JSON.stringify(ar)).not.toContain('تم تأكيد الحجز');
    expect(JSON.stringify(en).toLowerCase()).not.toContain('booking confirmed');
  });
});

describe('data rules', () => {
  it('has the five confirmed categories in order', () => {
    expect(CATEGORIES.map((c) => c.slug)).toEqual([
      'facial',
      'permanent-makeup',
      'hair',
      'nails',
      'henna',
    ]);
  });

  it('marks every demo record as demo', () => {
    expect([...demoServices, ...demoZones, ...demoBusinessHours].every((r) => r.isDemo)).toBe(true);
  });

  it('hides unpublished services and filters by place', () => {
    const all = filterServices(demoServices);
    expect(all.every((s) => s.published)).toBe(true);
    expect(filterServices(demoServices, { place: 'home' }).every((s) => s.availableAtHome)).toBe(
      true,
    );
    expect(filterServices(demoServices, { category: 'henna' })).toEqual([]);
  });

  it('serves nothing operational before data is approved', async () => {
    const repo = createEmptyRepository();
    expect(repo.isDemo).toBe(false);
    expect(await repo.getServices()).toEqual([]);
    expect(await repo.getActiveZones()).toEqual([]);
    const settings = await repo.getSettings();
    expect(settings.phone).toBeUndefined();
    expect(settings.whatsapp).toBeUndefined();
    expect(settings.homeTravelMinutes).toBeUndefined();
    expect(settings.pendingRequestsBlockSlots).toBe(false);
  });
});

describe('pricing', () => {
  it('shows a number only for an approved fixed price', () => {
    expect(getPriceDisplay({ priceMode: 'fixed', price: 120 })).toEqual({
      kind: 'fixed',
      amount: 120,
    });
    expect(getPriceDisplay({ priceMode: 'fixed' })).toEqual({ kind: 'after_review' });
    expect(getPriceDisplay({ priceMode: 'after_review', price: 120 })).toEqual({
      kind: 'after_review',
    });
  });

  it('never invents a total', () => {
    const fixed = { kind: 'fixed', amount: 100 } as const;
    expect(computeTotal(fixed, undefined, false)).toBe(100);
    expect(computeTotal(fixed, 50, true)).toBe(150);
    expect(computeTotal(fixed, undefined, true)).toBeUndefined();
    expect(computeTotal({ kind: 'after_review' }, 50, true)).toBeUndefined();
  });
});

describe('whatsapp link', () => {
  it('is hidden until a valid number exists', () => {
    expect(buildWhatsAppLink(undefined)).toBeNull();
    expect(buildWhatsAppLink('abc')).toBeNull();
  });
  it('adds the Qatar code to local 8-digit numbers', () => {
    expect(buildWhatsAppLink('5555 1234')).toBe('https://wa.me/97455551234');
    expect(buildWhatsAppLink('+974 5555 1234')).toBe('https://wa.me/97455551234');
  });
});

describe('environment check', () => {
  it('requires APP_ENV', () => {
    expect(checkEnv({})).toHaveLength(1);
    expect(checkEnv({ APP_ENV: 'preview' })).toEqual([]);
  });
  it('blocks production builds that would ship demo data', () => {
    const errors = checkEnv({
      APP_ENV: 'production',
      DATA_SOURCE: 'demo',
      NEXT_PUBLIC_SITE_URL: 'https://x.qa',
    });
    expect(errors.join()).toMatch(/DATA_SOURCE=amplify/);
    expect(checkEnv({ APP_ENV: 'production', DATA_SOURCE: 'amplify' }).join()).toMatch(
      /NEXT_PUBLIC_SITE_URL/,
    );
    expect(
      checkEnv({
        APP_ENV: 'production',
        DATA_SOURCE: 'amplify',
        NEXT_PUBLIC_SITE_URL: 'https://soso.qa',
      }),
    ).toEqual([]);
  });
});
