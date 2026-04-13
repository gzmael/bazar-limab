/** E.164 e.g. +5511987654321 → wa.me path digits only */
export function waMeUrl(e164: string, text: string) {
  const digits = e164.replace(/\D/g, '')
  const q = encodeURIComponent(text)
  return `https://wa.me/${digits}?text=${q}`
}
