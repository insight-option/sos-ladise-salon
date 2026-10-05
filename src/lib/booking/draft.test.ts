import { describe, expect, it } from 'vitest';
import {
  applyChange,
  DRAFT_TTL_MS,
  firstIncompleteStep,
  parseDraft,
  sanitizeDraft,
  serializeDraft,
  stepsFor,
} from './draft';

const NOW = Date.UTC(2026, 9, 5, 12);

describe('booking draft storage', () => {
  it('round-trips the non-personal fields', () => {
    const draft = {
      place: 'home' as const,
      serviceSlug: 'demo-hair-1',
      zoneId: 'demo-zone-a',
      date: '2026-10-06',
      time: '10:30',
    };
    expect(parseDraft(serializeDraft(draft, NOW), NOW + 1000)).toEqual(draft);
  });

  it('never stores personal data even if it is passed in', () => {
    const raw = serializeDraft(
      { place: 'salon', name: 'X', phone: '55555555', address: 'Y' } as never,
      NOW,
    );
    expect(raw).not.toMatch(/55555555|"name"|"address"/);
  });

  it('drops expired, future-dated, corrupt or wrong-version payloads', () => {
    const ok = serializeDraft({ place: 'salon' }, NOW);
    expect(parseDraft(ok, NOW + DRAFT_TTL_MS + 1)).toEqual({});
    expect(parseDraft(ok, NOW - 120_000)).toEqual({});
    expect(parseDraft('{not json', NOW)).toEqual({});
    expect(
      parseDraft(JSON.stringify({ v: 99, savedAt: NOW, draft: { place: 'salon' } }), NOW),
    ).toEqual({});
    expect(parseDraft(null, NOW)).toEqual({});
  });

  it('rejects invalid values', () => {
    expect(
      sanitizeDraft({ place: 'office', serviceSlug: '../x', date: '2026-13-99x', time: '25:00' }),
    ).toEqual({});
    // A time without a date is meaningless.
    expect(sanitizeDraft({ place: 'salon', time: '10:00' })).toEqual({ place: 'salon' });
    // Zones only apply to home visits.
    expect(sanitizeDraft({ place: 'salon', zoneId: 'demo-zone-a' })).toEqual({ place: 'salon' });
  });
});

describe('booking steps', () => {
  it('adds the area step only for home visits', () => {
    expect(stepsFor('salon')).toEqual(['place', 'service', 'datetime', 'details', 'review']);
    expect(stepsFor('home')).toEqual(['place', 'service', 'zone', 'datetime', 'details', 'review']);
  });

  it('resumes at the first missing choice (e.g. after signing in)', () => {
    expect(firstIncompleteStep({})).toBe('place');
    expect(firstIncompleteStep({ place: 'salon' })).toBe('service');
    expect(firstIncompleteStep({ place: 'home', serviceSlug: 's' })).toBe('zone');
    expect(firstIncompleteStep({ place: 'salon', serviceSlug: 's', date: '2026-10-06' })).toBe(
      'datetime',
    );
    expect(
      firstIncompleteStep({ place: 'salon', serviceSlug: 's', date: '2026-10-06', time: '10:00' }),
    ).toBe('details');
  });

  it('clears dependent choices when an earlier one changes', () => {
    const full = {
      place: 'home' as const,
      serviceSlug: 's',
      zoneId: 'z',
      date: '2026-10-06',
      time: '10:00',
    };
    expect(applyChange(full, { place: 'salon' })).toEqual({ place: 'salon' });
    expect(applyChange(full, { serviceSlug: 't' })).toEqual({
      place: 'home',
      serviceSlug: 't',
      zoneId: 'z',
    });
    expect(applyChange(full, { date: '2026-10-07' })).toEqual({
      ...full,
      date: '2026-10-07',
      time: undefined,
    });
    // Re-applying the same value keeps everything (e.g. query string after a language switch).
    expect(applyChange(full, { place: 'home', serviceSlug: 's' })).toEqual(full);
  });
});
