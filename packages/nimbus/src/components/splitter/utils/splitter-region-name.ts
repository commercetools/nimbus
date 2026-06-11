import type { SplitterPaneRole } from "../splitter.types";

/**
 * Derive the {@link RegionRegistry} name for one pane of a splitter from the
 * splitter's id and the pane role. Pane outlets register under these names and
 * `useSplitter` projects into them — so a single splitter `id` addresses both
 * panes without the consumer ever typing a region name.
 *
 * @internal
 */
export const splitterRegionName = (
  splitterId: string,
  role: SplitterPaneRole
): string => `nimbus-splitter:${splitterId}:${role}`;
