import type { ServicePlace } from '../data/types';
import { isHhMm, isIsoDate } from '../time';

/**
 * The part of a booking-in-progress that may be stored in the browser.
 * Deliberately excludes personal data (name, phone, address, notes) — spec §5.1.
 */
export interface BookingDraft {
  place?: ServicePlace;
  serviceSlug?: string;
  zoneId?: string;
  date?: string;
  time?: string;
}

export const DRAFT_STORAGE_KEY = 'soso.booking-draft';
const DRAFT_VERSION = 1;
export const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

export function sanitizeDraft(input: unknown): BookingDraft {
  if (!input || typeof input !== 'object') return {};
  const raw = input as Record<string, unknown>;
  const draft: BookingDraft = {};
  if (raw.place === 'salon' || raw.place === 'home') draft.place = raw.place;
  if (typeof raw.serviceSlug === 'string' && SLUG_RE.test(raw.serviceSlug))
    draft.serviceSlug = raw.serviceSlug;
  if (draft.place === 'home' && typeof raw.zoneId === 'string' && SLUG_RE.test(raw.zoneId))
    draft.zoneId = raw.zoneId;
  if (isIsoDate(raw.date)) draft.date = raw.date;
  if (draft.date && isHhMm(raw.time)) draft.time = raw.time;
  return draft;
}

export function serializeDraft(draft: BookingDraft, now: number): string {
  return JSON.stringify({ v: DRAFT_VERSION, savedAt: now, draft: sanitizeDraft(draft) });
}

export function parseDraft(raw: string | null, now: number): BookingDraft {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as { v?: unknown; savedAt?: unknown; draft?: unknown };
    if (parsed.v !== DRAFT_VERSION || typeof parsed.savedAt !== 'number') return {};
    if (now - parsed.savedAt > DRAFT_TTL_MS || parsed.savedAt > now + 60_000) return {};
    return sanitizeDraft(parsed.draft);
  } catch {
    return {};
  }
}

export type BookingStep = 'place' | 'service' | 'zone' | 'datetime' | 'details' | 'review';

export function stepsFor(place: ServicePlace | undefined): BookingStep[] {
  return place === 'home'
    ? ['place', 'service', 'zone', 'datetime', 'details', 'review']
    : ['place', 'service', 'datetime', 'details', 'review'];
}

/** First step whose required draft fields are still missing. Details/review need user input on screen. */
export function firstIncompleteStep(draft: BookingDraft): BookingStep {
  if (!draft.place) return 'place';
  if (!draft.serviceSlug) return 'service';
  if (draft.place === 'home' && !draft.zoneId) return 'zone';
  if (!draft.date || !draft.time) return 'datetime';
  return 'details';
}

/** Changing an earlier choice invalidates later ones that depended on it. */
export function applyChange(draft: BookingDraft, change: Partial<BookingDraft>): BookingDraft {
  const next: BookingDraft = { ...draft, ...change };
  if ('place' in change && change.place !== draft.place) {
    delete next.serviceSlug;
    delete next.zoneId;
    delete next.date;
    delete next.time;
  }
  if ('serviceSlug' in change && change.serviceSlug !== draft.serviceSlug) {
    delete next.date;
    delete next.time;
  }
  if ('date' in change && change.date !== draft.date) delete next.time;
  return sanitizeDraft(next);
}
