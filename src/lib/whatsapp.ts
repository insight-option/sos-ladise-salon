/** Contact links and display formats for Qatari numbers. Invalid input yields null so the UI hides the button. */

function toInternational(rawNumber: string | undefined): string | null {
  if (!rawNumber) return null;
  const digits = rawNumber.replace(/[\s()+-]/g, '');
  if (!/^\d{8,15}$/.test(digits)) return null;
  // Local Qatari numbers are 8 digits; links need the 974 country code.
  return digits.length === 8 ? `974${digits}` : digits;
}

export function buildWhatsAppLink(rawNumber: string | undefined, text?: string): string | null {
  const international = toInternational(rawNumber);
  if (!international) return null;
  const url = new URL(`https://wa.me/${international}`);
  if (text) url.searchParams.set('text', text);
  return url.toString();
}

export function buildTelLink(rawNumber: string | undefined): string | null {
  const international = toInternational(rawNumber);
  return international ? `tel:+${international}` : null;
}

/** "+974 3342 8070" — always rendered left-to-right, also inside Arabic text. */
export function formatPhoneDisplay(rawNumber: string | undefined): string | null {
  const international = toInternational(rawNumber);
  if (!international?.startsWith('974') || international.length !== 11) return null;
  const local = international.slice(3);
  return `+974 ${local.slice(0, 4)} ${local.slice(4)}`;
}
