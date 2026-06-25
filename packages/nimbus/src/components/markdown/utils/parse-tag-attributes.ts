/**
 * Parse the attribute portion of a custom component tag into a props object.
 * Pure and React-free so it can be unit-tested in isolation.
 *
 * Supported forms (attribute-name casing is preserved verbatim):
 * - `name="value"` / `name='value'` → string value
 * - `name=bare`                     → string value (unquoted, no whitespace)
 * - `name`                          → boolean `true` (valueless attribute)
 * - `name={expr}`                   → DROPPED (expressions are never evaluated)
 *
 * The matcher is quote-aware, so a value such as `label="a > b"` keeps its `>`.
 */
const ATTRIBUTE_RE =
  /([A-Za-z_][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\{[^}]*\})|(\S+)))?/g;

export function parseTagAttributes(
  attrString: string | undefined | null
): Record<string, string | boolean> {
  const props: Record<string, string | boolean> = {};
  if (!attrString) return props;

  ATTRIBUTE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ATTRIBUTE_RE.exec(attrString)) !== null) {
    // Guard against zero-width matches looping forever.
    if (match[0] === "") {
      ATTRIBUTE_RE.lastIndex += 1;
      continue;
    }
    if (!match[0].trim()) continue;

    const [, name, doubleQuoted, singleQuoted, expression, bare] = match;
    if (expression !== undefined) continue; // {expr}: never evaluated → drop
    if (doubleQuoted !== undefined) props[name] = doubleQuoted;
    else if (singleQuoted !== undefined) props[name] = singleQuoted;
    else if (bare !== undefined) props[name] = bare;
    else props[name] = true; // valueless boolean attribute
  }

  return props;
}
