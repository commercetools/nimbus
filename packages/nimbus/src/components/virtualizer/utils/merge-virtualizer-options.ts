/**
 * Merge a consumer's virtualizer options over a collection's defaults.
 *
 * Consumer values win. A consumer value of `undefined` does not erase a
 * default, so spreading optional props through is safe.
 */
export function mergeVirtualizerOptions<T extends object>(
  defaults: T,
  overrides?: Partial<T>
): T {
  const merged = { ...defaults };
  if (!overrides) return merged;

  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const value = overrides[key];
    if (value !== undefined) merged[key] = value as T[keyof T];
  }
  return merged;
}
