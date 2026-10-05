import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';
import { CATEGORIES } from './data/categories';
import { LOGO, SITE_IMAGES } from './data/media';
import { SITE } from './data/site';
import { buildTelLink, buildWhatsAppLink, formatPhoneDisplay } from './whatsapp';
import { checkEnv } from '../../scripts/check-env.mjs';

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

const publicFile = (src: string) => join(process.cwd(), 'public', src);

describe('translations', () => {
  it('Arabic and English define exactly the same keys', () => {
    expect(keys(ar).sort()).toEqual(keys(en).sort());
  });

  it('uses the approved Arabic copy verbatim', () => {
    expect(ar.hero.title).toBe('جمالك وراحتك… في الصالون أو في بيتك');
    expect(ar.hero.bookSalon).toBe('احجزي في الصالون');
    expect(ar.hero.bookHome).toBe('اطلبي خدمة منزلية');
    expect(ar.contact.call).toBe('اتصلي بنا');
    expect(ar.contact.whatsapp).toBe('تواصلي عبر واتساب');
  });

  it('makes no claims the showcase site cannot back up', () => {
    const all = JSON.stringify(ar) + JSON.stringify(en).toLowerCase();
    expect(all).not.toContain('تم تأكيد الحجز');
    expect(all).not.toMatch(/ر\.ق|qar|\d+ ?(دقيقة|min)/);
  });

  it('uses Latin digits only', () => {
    expect(JSON.stringify(ar)).not.toMatch(/[٠-٩]/);
  });
});

describe('content', () => {
  it('has the five confirmed categories in order, each with an existing image', () => {
    expect(CATEGORIES.map((c) => c.slug)).toEqual([
      'facial',
      'permanent-makeup',
      'hair',
      'nails',
      'henna',
    ]);
    for (const c of CATEGORIES) expect(existsSync(publicFile(c.image.src)), c.image.src).toBe(true);
  });

  it('marks every supplied photo as illustrative and gives it alt text in both languages', () => {
    for (const img of [...Object.values(SITE_IMAGES), ...CATEGORIES.map((c) => c.image)]) {
      expect(img.kind).toBe('illustrative');
      expect(img.alt.ar.length).toBeGreaterThan(5);
      expect(img.alt.en.length).toBeGreaterThan(5);
      expect(existsSync(publicFile(img.src)), img.src).toBe(true);
    }
    expect(existsSync(publicFile(LOGO.src))).toBe(true);
    expect(existsSync(publicFile('media/hero.mp4'))).toBe(true);
    expect(existsSync(publicFile('media/hero-poster.jpg'))).toBe(true);
  });
});

describe('approved contact numbers', () => {
  it('are exactly the owner-approved numbers', () => {
    expect(SITE.phone).toBe('33428070');
    expect(SITE.whatsapp).toBe('74748944');
  });

  it('build the exact approved links and display text', () => {
    expect(buildTelLink(SITE.phone)).toBe('tel:+97433428070');
    expect(formatPhoneDisplay(SITE.phone)).toBe('+974 3342 8070');
    expect(buildWhatsAppLink(SITE.whatsapp)).toBe('https://wa.me/97474748944');
    expect(formatPhoneDisplay(SITE.whatsapp)).toBe('+974 7474 8944');
  });

  it('prefills WhatsApp messages', () => {
    const link = new URL(buildWhatsAppLink(SITE.whatsapp, ar.wa.salon)!);
    expect(link.origin + link.pathname).toBe('https://wa.me/97474748944');
    expect(link.searchParams.get('text')).toBe(ar.wa.salon);
  });

  it('rejects invalid numbers', () => {
    expect(buildWhatsAppLink(undefined)).toBeNull();
    expect(buildWhatsAppLink('abc')).toBeNull();
    expect(buildTelLink('123')).toBeNull();
  });
});

describe('environment check', () => {
  it('defaults to preview and needs nothing else', () => {
    expect(checkEnv({})).toEqual([]);
    expect(checkEnv({ APP_ENV: 'staging' })).toHaveLength(1);
  });

  it('production needs an https origin, explicit or derived on Amplify', () => {
    expect(checkEnv({ APP_ENV: 'production' }).join()).toMatch(/NEXT_PUBLIC_SITE_URL/);
    expect(checkEnv({ APP_ENV: 'production', AWS_APP_ID: 'd1', AWS_BRANCH: 'main' })).toEqual([]);
    expect(checkEnv({ APP_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'http://x.qa' })).toHaveLength(
      1,
    );
    expect(checkEnv({ APP_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://soso.qa' })).toEqual(
      [],
    );
  });
});
