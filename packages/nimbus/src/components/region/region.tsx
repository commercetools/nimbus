import { RegionRoot } from "./region.root";
import { RegionOutlet } from "./region.outlet";

/**
 * Region
 * ============================================================
 * A headless, component-agnostic primitive for **named regions** — "render this
 * content over there." A `Region.Root` establishes a scope; `Region.Outlet`s
 * mark named render targets within it; consumers project content into a target
 * by name with `useRegion(name)`. Projected content paints at the outlet while
 * staying in the author's React tree, so all ancestor context is preserved.
 *
 * The `Splitter` is the first consumer — its aside can host an outlet and
 * `useRegion` projects into it — but `Region` stands alone for any future
 * component that needs the same "project content into a slot" capability.
 *
 * @example
 * ```tsx
 * <Region.Root>
 *   <SomeDeeplyNestedThing />
 *   <Region.Outlet name="sidebar" />
 * </Region.Root>
 *
 * // anywhere inside the root:
 * const { Region: Sidebar } = useRegion("sidebar");
 * return <Sidebar>{content}</Sidebar>;
 * ```
 */
export const Region = {
  /**
   * # Region.Root
   *
   * Establishes a named-region scope. Reuses an ancestor root's registry if
   * present, so the namespace is shared across nesting.
   */
  Root: RegionRoot,
  /**
   * # Region.Outlet
   *
   * Marks where a named region renders and registers its DOM node under `name`.
   */
  Outlet: RegionOutlet,
};

// Underscore-prefixed re-exports for react-docgen-typescript prop-table
// extraction. Consumers should use the namespaced `Region.Root` /
// `Region.Outlet`.
export { RegionRoot as _RegionRoot, RegionOutlet as _RegionOutlet };
