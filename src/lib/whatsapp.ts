/**
 * Builds a wa.me link from an approved number. Returns null when no valid number is configured,
 * so the UI hides the WhatsApp button instead of linking somewhere wrong.
 */
export function buildWhatsAppLink(rawNumber: string | undefined, text?: string): string | null {
  if (!rawNumber) return null;
  const digits = rawNumber.replace(/[\s()+-]/g, '');
  if (!/^\d{8,15}$/.test(digits)) return null;
  // Local Qatari numbers are 8 digits; wa.me needs the 974 country code.
  const international = digits.length === 8 ? `974${digits}` : digits;
  const url = new URL(`https://wa.me/${international}`);
  if (text) url.searchParams.set('text', text);
  return url.toString();
}
