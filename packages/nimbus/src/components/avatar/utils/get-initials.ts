/**
 * Extract a one- or two-character initials string from the supplied names.
 *
 * Defensive against missing input: handles `undefined`, empty strings, and
 * whitespace-only strings by trimming and dropping empty parts. Codepoint-
 * safe: uses `Array.from` so astral-plane characters (e.g. emoji surrogate
 * pairs) are not split mid-surrogate. Returns an empty string when neither
 * input yields a usable character — callers use that signal to render the
 * `Person` icon fallback instead of text.
 */
export function getInitials(firstName?: string, lastName?: string) {
  const first = Array.from((firstName ?? "").trim())[0]?.toUpperCase() ?? "";
  const last = Array.from((lastName ?? "").trim())[0]?.toUpperCase() ?? "";
  return `${first}${last}`;
}
