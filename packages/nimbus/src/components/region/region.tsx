import { RegionTarget } from "./region.target";
import { RegionProvider } from "./region.provider";

/**
 * Region
 * ============================================================
 * A headless, component-agnostic primitive for **named regions** — "render this
 * content over there." Two sides:
 *
 * - **place a target**: `<Region name="foo" />` marks where a named region
 *   renders. It's layout-transparent (`display: contents`), so projected content
 *   lays out as a direct child of the target's parent.
 * - **fill it**: `const { Region, value } = useRegion("foo")` returns a stable
 *   portal to project content into the target (plus any `value` the target
 *   published). Projected content paints at the target while staying in the
 *   author's React tree, so all ancestor context is preserved.
 *
 * The scope is provided by `Region.Provider`, which is mounted **ambiently**
 * inside `NimbusProvider` — so in a Nimbus app you place targets and call
 * `useRegion` without ever wrapping anything yourself.
 *
 * @example
 * // somewhere in the layout (e.g. an app shell):
 * <Region name="sidebar" />
 *
 * // anywhere else, even a different package:
 * const { Region: Sidebar } = useRegion("sidebar");
 * return <Sidebar>{content}</Sidebar>;
 */
export const Region = Object.assign(RegionTarget, {
  /**
   * # Region.Provider
   *
   * Establishes a named-region scope. Mounted ambiently by `NimbusProvider`, so
   * you rarely write it directly. Reuses an ancestor provider's registry when
   * nested, and renders no DOM element of its own — hence `.Provider`, not
   * `.Root`.
   */
  Provider: RegionProvider,
});

// Underscore-prefixed re-exports for react-docgen-typescript prop-table
// extraction. Consumers should use `Region` / `Region.Provider`.
export { RegionTarget as _Region, RegionProvider as _RegionProvider };
