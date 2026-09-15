/**
 * Segment keys of a stacked dataset, as the union across every row in
 * first-seen order.
 *
 * Reading keys from `rows[0].segments` alone (the pattern this replaces) drops
 * any segment that happens to be missing from the first row — a ragged row
 * later in the data is then drawn without that segment and the legend never
 * lists it. The type-level contract ("all rows share keys") is a convention,
 * not something the compiler enforces, so the union is the safe derivation.
 *
 * `segmentsOf` defaults to reading `row.segments` directly (every existing
 * caller's row type has that field); a chart generic over a custom row type
 * `T` (accessors instead of a fixed shape — see `StackedBarChart<T>`) passes
 * its own `segments` accessor instead.
 */
export function stackKeys<T>(
  rows: readonly T[],
  segmentsOf: (row: T) => readonly { key: string }[] = (row) =>
    (row as unknown as { segments: readonly { key: string }[] }).segments
): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const row of rows) {
    for (const segment of segmentsOf(row)) {
      if (!seen.has(segment.key)) {
        seen.add(segment.key);
        keys.push(segment.key);
      }
    }
  }
  return keys;
}
