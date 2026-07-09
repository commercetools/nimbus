/**
 * Resolve a deprecated string variant alias to its replacement.
 *
 * A `variant` prop can be a concrete string or a responsive object/array; only
 * plain-string values are remapped (via `aliases`), while unknown strings and
 * responsive values pass through untouched. Used by components that keep a
 * deprecated variant name working as a non-breaking alias for its replacement
 * (e.g. Tabs `pills` → `pill`, TabNav `tabs` → `line`) so the recipe only ever
 * sees real variant keys.
 *
 * @example
 * ```ts
 * resolveVariantAlias("pills", { pills: "pill" }); // "pill"
 * resolveVariantAlias("line", { pills: "pill" });  // "line" (pass-through)
 * ```
 */
export function resolveVariantAlias<T>(
  value: T,
  aliases: Record<string, string>
): T {
  return typeof value === "string" && aliases[value]
    ? (aliases[value] as T)
    : value;
}
