/** Accepts a Qatari number with or without the country code, ignoring spaces, dashes and brackets. */
export function isValidQatarPhone(raw: string): boolean {
  const compact = raw.replace(/[\s()-]/g, '');
  return /^(?:\+974|00974|974)?\d{8}$/.test(compact);
}
