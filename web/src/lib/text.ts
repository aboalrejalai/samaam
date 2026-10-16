const ARABIC_SCRIPT = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

/**
 * Direction of a quoted passage.
 *
 * Statutory text is rendered in the language it was issued in, so an English
 * provision quoted inside the Arabic UI needs `dir="ltr"` on its own paragraph
 * and vice versa. The resolved citations on the wire carry no language field,
 * so the script itself is the signal.
 */
export function scriptDirection(text: string | undefined): 'ltr' | 'rtl' {
  return text !== undefined && ARABIC_SCRIPT.test(text) ? 'rtl' : 'ltr'
}

/**
 * Two-letter monogram for an avatar: first letter of the first and last name.
 *
 * Arabic surnames usually carry the article (السهلي، الحربي), so a leading
 * «ال» is skipped or every monogram would end in «ا». The letters are joined
 * with a zero-width non-joiner so Arabic initials stay as separate glyphs.
 */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  if (words.length < 2) return first.toUpperCase()
  const last = (words.at(-1) ?? '').replace(/^ال(?=.)/, '')
  return `${first}‌${last[0] ?? ''}`.toUpperCase()
}
