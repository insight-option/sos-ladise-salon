import { describe, expect, it } from 'vitest';
import type { BusinessHours } from '../data/types';
import { listDemoSlots, upcomingDates } from './demo-slots';

const hours: BusinessHours[] = [0, 1, 2, 3, 4, 5, 6].map((weekday) =>
  weekday === 5
    ? { weekday, closed: true, isDemo: true }
    : { weekday, open: '10:00', close: '12:00', closed: false, isDemo: true },
);

// 2026-10-05 is a Monday; 2026-10-09 is a Friday.
const MORNING_BEFORE = new Date('2026-10-05T05:00:00Z'); // 08:00 in Qatar

describe('listDemoSlots', () => {
  it('fits the service duration inside opening hours', () => {
    expect(
      listDemoSlots({ date: '2026-10-06', hours, durationMinutes: 60, now: MORNING_BEFORE }),
    ).toEqual(['10:00', '10:30', '11:00']);
    expect(
      listDemoSlots({ date: '2026-10-06', hours, durationMinutes: 90, now: MORNING_BEFORE }),
    ).toEqual(['10:00', '10:30']);
    expect(
      listDemoSlots({ date: '2026-10-06', hours, durationMinutes: 150, now: MORNING_BEFORE }),
    ).toEqual([]);
  });

  it('returns nothing on closed days and in the past', () => {
    expect(
      listDemoSlots({ date: '2026-10-09', hours, durationMinutes: 30, now: MORNING_BEFORE }),
    ).toEqual([]);
    expect(
      listDemoSlots({ date: '2026-10-04', hours, durationMinutes: 30, now: MORNING_BEFORE }),
    ).toEqual([]);
  });

  it('hides times that have already started today (Qatar time)', () => {
    const at1015Qatar = new Date('2026-10-05T07:15:00Z');
    expect(
      listDemoSlots({ date: '2026-10-05', hours, durationMinutes: 30, now: at1015Qatar }),
    ).toEqual(['10:30', '11:00', '11:30']);
  });

  it('reserves travel time before and after home visits', () => {
    expect(
      listDemoSlots({
        date: '2026-10-06',
        hours,
        durationMinutes: 60,
        now: MORNING_BEFORE,
        travelMinutes: 30,
      }),
    ).toEqual(['10:30']);
  });
});

describe('upcomingDates', () => {
  it('starts from the Qatar calendar day across the UTC midnight boundary', () => {
    // 21:30 UTC on Oct 5 is already 00:30 on Oct 6 in Qatar.
    expect(upcomingDates(new Date('2026-10-05T21:30:00Z'), 2)).toEqual([
      '2026-10-06',
      '2026-10-07',
    ]);
    // 20:59 UTC is still 23:59 on Oct 5 in Qatar.
    expect(upcomingDates(new Date('2026-10-05T20:59:00Z'), 1)).toEqual(['2026-10-05']);
  });
});
