// Import from the barrel export index for consistent module resolution.
import {
  SplitterRoot,
  SplitterAside,
  SplitterMain,
  SplitterHandle,
} from "./components";

/**
 * Splitter
 * ============================================================
 * Compound primitive for a user-resizable 2-pane layout: a configurable
 * `Splitter.Aside` and a `Splitter.Main` that fills the remaining space.
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/}
 *
 * @example
 * ```tsx
 * <Splitter.Root defaultSize={30} minSize={15}>
 *   <Splitter.Aside>Navigation</Splitter.Aside>
 *   <Splitter.Handle />
 *   <Splitter.Main>Content</Splitter.Main>
 * </Splitter.Root>
 * ```
 */
export const Splitter = {
  /**
   * # Splitter.Root
   *
   * The root container that owns the single aside `size` and the flat sizing /
   * collapse configuration. Must wrap one `Splitter.Aside` and one
   * `Splitter.Main` with one `Splitter.Handle` between them (aside on either
   * side).
   *
   * @example
   * ```tsx
   * <Splitter.Root orientation="horizontal" defaultSize={40}>
   *   <Splitter.Aside>Left</Splitter.Aside>
   *   <Splitter.Handle />
   *   <Splitter.Main>Right</Splitter.Main>
   * </Splitter.Root>
   * ```
   */
  Root: SplitterRoot,
  /**
   * # Splitter.Aside
   *
   * The configurable pane. Its size is driven by `Splitter.Root`'s `size` /
   * `defaultSize` (and `minSize` / `maxSize` / collapse config); carries only
   * its content and an optional `id`.
   *
   * @example
   * ```tsx
   * <Splitter.Aside>Sidebar content</Splitter.Aside>
   * ```
   */
  Aside: SplitterAside,
  /**
   * # Splitter.Main
   *
   * The primary content pane. Always takes the space the aside does not
   * (`100 − size`); never configured directly. Carries only its content and an
   * optional `id`.
   *
   * @example
   * ```tsx
   * <Splitter.Main>Main content</Splitter.Main>
   * ```
   */
  Main: SplitterMain,
  /**
   * # Splitter.Handle
   *
   * The interactive separator between the aside and main panes. Drag, arrow
   * keys, and Home/End move the boundary; Enter toggles the aside's collapse
   * (also controllable via `Splitter.Root`'s `collapsed`); double-click restores
   * the boundary to its initial size.
   *
   * @example
   * ```tsx
   * <Splitter.Handle aria-label="Resize navigation" />
   * ```
   */
  Handle: SplitterHandle,
};

// Underscore-prefixed re-exports exist solely so the react-docgen-typescript
// script can extract per-subcomponent prop tables. Consumers should use the
// namespaced `Splitter.Root` / `Splitter.Aside` / `Splitter.Main` /
// `Splitter.Handle`.
export {
  SplitterRoot as _SplitterRoot,
  SplitterAside as _SplitterAside,
  SplitterMain as _SplitterMain,
  SplitterHandle as _SplitterHandle,
};
