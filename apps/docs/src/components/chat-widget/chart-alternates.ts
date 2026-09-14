/**
 * All distinct chart CONFIGURATIONS that can render a given DataKind's data —
 * client-side, since it drives the "alternate chart type" picker UI directly.
 * `chartRegistry` is a plain public export of `@commercetools/nimbus-viz`
 * (packages/nimbus-viz/src/selection/registry.tsx), already effectively
 * bundled client-side today via `resolveByName`/`ResolvedChart`, so importing
 * it here for real (not `import type`) introduces nothing new.
 */
import { chartRegistry } from "@commercetools/nimbus-viz";
import type { ChartRegistryEntry, DataKind } from "@commercetools/nimbus-viz";

/**
 * Every registered chart that can render `kind`'s data, deduped by
 * `metadata.configLabel` — nimbus-viz's own purpose-built dedup key
 * ("structural configuration signature — base chart + variant + overlay set,
 * ignoring persona, labels, and threshold values",
 * packages/nimbus-viz/src/selection/types.ts). This collapses the dozens of
 * persona-flavored presets sharing a kind (e.g. "series" has ~31 raw entries)
 * down to the handful of genuinely different chart types. Canonical entries
 * and higher `perceptualRank` win the tie-break for which entry represents a
 * dedup group; the final list sorts canonical-first, then
 * perceptual-rank-descending.
 *
 * Pure — chartRegistry is a static, already-built Map, so this is a pure
 * function of `kind` alone.
 */
export function getAlternateCharts(kind: DataKind): ChartRegistryEntry[] {
  const matches = [...chartRegistry.values()].filter((entry) =>
    entry.dataKinds.includes(kind)
  );

  const byConfig = new Map<string, ChartRegistryEntry>();
  for (const entry of matches) {
    const key = entry.metadata.configLabel ?? entry.metadata.name;
    const incumbent = byConfig.get(key);
    if (!incumbent || isBetterRepresentative(entry, incumbent)) {
      byConfig.set(key, entry);
    }
  }

  return [...byConfig.values()].sort(
    (a, b) =>
      Number(b.canonical ?? true) - Number(a.canonical ?? true) ||
      b.metadata.perceptualRank - a.metadata.perceptualRank
  );
}

function isBetterRepresentative(
  candidate: ChartRegistryEntry,
  incumbent: ChartRegistryEntry
): boolean {
  const candidateCanonical = candidate.canonical ?? true;
  const incumbentCanonical = incumbent.canonical ?? true;
  if (candidateCanonical !== incumbentCanonical) return candidateCanonical;
  return candidate.metadata.perceptualRank > incumbent.metadata.perceptualRank;
}

/**
 * Short, human-readable menu-item label for one alternate — humanizes the
 * registry name ("ranked-bar-chart" -> "Ranked bar chart") rather than using
 * `baseComponent` (can't disambiguate siblings, e.g. bar-chart and
 * radial-bar-chart both report baseComponent "BarChart") or `questionString`
 * (a full sentence, too long for a compact menu item).
 */
export function chartAlternateLabel(entry: ChartRegistryEntry): string {
  const [first, ...rest] = entry.metadata.name.split("-");
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
}
