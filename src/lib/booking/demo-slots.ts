import type { BusinessHours } from '../data/types';
import { addDays, fromMinutes, toMinutes, wallClockIn, weekdayOf } from '../time';

/**
 * PREVIEW-ONLY slot listing: opening hours + service duration, no staff, bookings or blocks.
 * The real availability engine runs on the server in Phase 5 and replaces this.
 */
export function listDemoSlots(args: {
  date: string;
  hours: readonly BusinessHours[];
  durationMinutes: number;
  now: Date;
  stepMinutes?: number;
  travelMinutes?: number;
}): string[] {
  const { date, hours, durationMinutes, now, stepMinutes = 30, travelMinutes = 0 } = args;
  const day = hours.find((h) => h.weekday === weekdayOf(date));
  if (!day || day.closed || !day.open || !day.close) return [];

  const open = toMinutes(day.open) + travelMinutes;
  const close = toMinutes(day.close) - travelMinutes;
  const today = wallClockIn(now);
  if (date < today.date) return [];

  const slots: string[] = [];
  for (let start = open; start + durationMinutes <= close; start += stepMinutes) {
    if (date === today.date && start <= today.minutes) continue;
    slots.push(fromMinutes(start));
  }
  return slots;
}

/** The next `count` calendar dates starting today in Qatar. */
export function upcomingDates(now: Date, count = 14): string[] {
  const today = wallClockIn(now).date;
  return Array.from({ length: count }, (_, i) => addDays(today, i));
}
