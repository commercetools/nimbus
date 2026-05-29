// Import from the barrel export index for consistent module resolution.
import { SplitterRoot, SplitterPane, SplitterHandle } from "./components";

/**
 * Splitter
 * ============================================================
 * Compound primitive for a user-resizable 2-pane layout.
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/}
 *
 * @example
 * ```tsx
 * <Splitter.Root panes={{ nav: { minSize: 10 }, main: { minSize: 20 } }}>
 *   <Splitter.Pane id="nav">Navigation</Splitter.Pane>
 *   <Splitter.Handle />
 *   <Splitter.Pane id="main">Content</Splitter.Pane>
 * </Splitter.Root>
 * ```
 */
export const Splitter = {
  /**
   * # Splitter.Root
   *
   * The root container that owns sizes state for its two child panes and hosts
   * the per-pane `panes` configuration map. Must wrap exactly two
   * `Splitter.Pane`s with one `Splitter.Handle` between them.
   *
   * @example
   * ```tsx
   * <Splitter.Root orientation="horizontal">
   *   <Splitter.Pane id="left">Left</Splitter.Pane>
   *   <Splitter.Handle />
   *   <Splitter.Pane id="right">Right</Splitter.Pane>
   * </Splitter.Root>
   * ```
   */
  Root: SplitterRoot,
  /**
   * # Splitter.Pane
   *
   * A resizable region inside `Splitter.Root`. Carries only its `id` and
   * content — all per-pane configuration (size, constraints, collapsibility)
   * lives on `Splitter.Root` in the `panes` map keyed by this `id`.
   *
   * @example
   * ```tsx
   * <Splitter.Pane id="sidebar">Sidebar content</Splitter.Pane>
   * ```
   */
  Pane: SplitterPane,
  /**
   * # Splitter.Handle
   *
   * The interactive separator between the two panes. Drag, arrow keys, and
   * Home/End move the boundary; Enter toggles collapse of an adjacent
   * collapsible pane (also controllable via `Splitter.Root`'s `collapsedPane`);
   * double-click restores the boundary to its initial sizes.
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
// namespaced `Splitter.Root` / `Splitter.Pane` / `Splitter.Handle`.
export {
  SplitterRoot as _SplitterRoot,
  SplitterPane as _SplitterPane,
  SplitterHandle as _SplitterHandle,
};
