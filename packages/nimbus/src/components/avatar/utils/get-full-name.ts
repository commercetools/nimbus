/**
 * Compose a display-ready full name from the trimmed non-empty parts.
 * Returns "" when both inputs are missing/empty/whitespace-only so the
 * caller can fall back to a generic localized label.
 */
export function getFullName(firstName?: string, lastName?: string) {
  return [firstName, lastName]
    .map((s) => s?.trim() ?? "")
    .filter(Boolean)
    .join(" ");
}
