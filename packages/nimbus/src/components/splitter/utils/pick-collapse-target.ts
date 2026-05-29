/**
 * Select the pane to toggle on double-click / Enter for a 2-pane splitter.
 *
 * Resolution:
 *   - Neither pane collapsible → `null` (no-op).
 *   - Exactly one collapsible → that pane.
 *   - Both collapsible → the smaller of the two (ties → previous/left/top).
 *
 * @param paneOrder - Registered pane ids in DOM order (`[prev, next]`).
 * @param sizes - Current id-keyed sizes record.
 * @param getPaneConfig - Looks up a pane's config; only `collapsible` is read.
 * @returns The collapse target and its sibling, or `null` when neither pane
 *   can collapse.
 *
 * @example
 * pickCollapseTarget(["a", "b"], { a: 20, b: 80 }, (id) => ({ collapsible: true }));
 * // → { paneId: "a", otherId: "b" }
 */
export const pickCollapseTarget = (
  paneOrder: string[],
  sizes: Record<string, number>,
  getPaneConfig: (id: string) => { collapsible?: boolean }
): { paneId: string; otherId: string } | null => {
  if (paneOrder.length !== 2) return null;
  const [prevId, nextId] = paneOrder as [string, string];
  const prevCollapsible = !!getPaneConfig(prevId).collapsible;
  const nextCollapsible = !!getPaneConfig(nextId).collapsible;
  if (!prevCollapsible && !nextCollapsible) return null;
  if (prevCollapsible && !nextCollapsible) {
    return { paneId: prevId, otherId: nextId };
  }
  if (!prevCollapsible && nextCollapsible) {
    return { paneId: nextId, otherId: prevId };
  }
  const prevSize = sizes[prevId] ?? 0;
  const nextSize = sizes[nextId] ?? 0;
  if (prevSize <= nextSize) return { paneId: prevId, otherId: nextId };
  return { paneId: nextId, otherId: prevId };
};
