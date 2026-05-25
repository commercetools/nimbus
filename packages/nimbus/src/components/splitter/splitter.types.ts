import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { ReactNode, Ref, RefObject } from "react";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type SplitterRecipeProps = SlotRecipeProps<"nimbusSplitter">;

// ============================================================
// SHARED VALUE TYPES
// ============================================================

/**
 * Per-pane configuration on `Splitter.Root`'s `panes` map. All settings are
 * keyed by the pane's `id` (matching the `id` on each `<Splitter.Pane>`).
 */
export type SplitterPaneConfig = {
  /** Initial percentage size for this pane (0–100). Ignored if `defaultSizes` is set on Root. */
  defaultSize?: number;
  /** Minimum allowed percentage; drag/keyboard clamps at this boundary. Defaults to 0. */
  minSize?: number;
  /** Maximum allowed percentage; drag/keyboard clamps at this boundary. Defaults to 100. */
  maxSize?: number;
  /** When true, drag interactions on the handle are ignored for this pane. */
  disabled?: boolean;
  /** When true, the pane can collapse to `collapsedSize` via double-click, Enter, or imperative API. */
  collapsible?: boolean;
  /** Percentage size when the pane is collapsed. Defaults to 0. */
  collapsedSize?: number;
};

/**
 * Imperative command surface exposed via `useSplitterLayout`. The hook
 * populates an internal ref the component mounts to; this is not part of
 * the public component prop surface.
 *
 * @internal
 */
export type SplitterImperativeHandle = {
  /** Replace the current sizes record (values must sum to 100). */
  setSizes: (sizes: Record<string, number>) => void;
  /** Read the current sizes record. */
  getSizes: () => Record<string, number>;
  /** Collapse a collapsible pane to its `collapsedSize`. */
  collapse: (paneId: string) => void;
  /** Expand a collapsed pane back to its `defaultSize` (or initial size). */
  expand: (paneId: string) => void;
  /** True if the pane is currently at or below its `collapsedSize`. */
  isCollapsed: (paneId: string) => boolean;
};

// ============================================================
// SLOT PROPS
// ============================================================

export type SplitterRootSlotProps = HTMLChakraProps<"div", SplitterRecipeProps>;

export type SplitterPaneSlotProps = HTMLChakraProps<"div">;

export type SplitterHandleSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for `<Splitter.Root>` — the compound root that owns sizes state for
 * its two child `Splitter.Pane`s. Configuration for each pane lives in the
 * `panes` map keyed by pane id.
 */
export type SplitterRootProps = OmitInternalProps<SplitterRootSlotProps> & {
  /**
   * The orientation of the splitter — drives layout direction and which
   * arrow keys are active on the handle. The handle's `aria-orientation`
   * reflects this prop (W3C separator semantics).
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Initial sizes for each pane, keyed by pane id, summing to 100. Read once
   * on mount; subsequent prop changes are ignored. When omitted, sizes are
   * derived from `panes[id].defaultSize`, falling back to a 50/50 split.
   */
  defaultSizes?: Record<string, number>;

  /**
   * Notification callback fired on every size change (drag, keyboard, collapse,
   * imperative). Receives the post-change sizes record (sums to 100).
   */
  onSizesChange?: (sizes: Record<string, number>) => void;

  /**
   * Per-pane configuration keyed by the pane's `id`. All per-pane settings
   * (min/max, collapsible, disabled, defaults) live here — nothing leaks
   * onto `<Splitter.Pane>`.
   */
  panes?: Record<string, SplitterPaneConfig>;

  /**
   * Percentage delta applied per arrow-key press on the focused handle.
   * Home/End jump the boundary to the relevant `minSize`/`maxSize`.
   * @default 5
   */
  keyboardStep?: number;

  /**
   * When true, double-click on the handle does not toggle collapse. Drag and
   * keyboard remain active.
   * @default false
   */
  disableDoubleClick?: boolean;

  /** Fired when a collapsible pane transitions to its `collapsedSize`. */
  onCollapse?: (paneId: string) => void;

  /** Fired when a collapsed pane transitions back above its `collapsedSize`. */
  onExpand?: (paneId: string) => void;

  /**
   * Internal ref used by `useSplitterLayout` to attach imperative commands.
   * Not part of the public surface — consumers go through the hook.
   * @internal
   */
  __layoutRef?: RefObject<SplitterImperativeHandle | null>;

  /** Exactly two `Splitter.Pane` children with one `Splitter.Handle` between them. */
  children: ReactNode;

  /** Ref to the root element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for `<Splitter.Pane>` — the resizable region. Each pane carries only
 * its `id` and content; all per-pane configuration lives on `<Splitter.Root>`
 * in the `panes` map keyed by this `id`.
 */
export type SplitterPaneProps = OmitInternalProps<SplitterPaneSlotProps> & {
  /** Unique pane id used to look up size and per-pane configuration on Root. */
  id: string;

  /** Pane content. */
  children?: ReactNode;

  /** Ref to the pane element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for `<Splitter.Handle>` — the interactive separator between the two
 * panes. The handle is anonymous: it accepts no `id` and no per-handle
 * configuration. Behaviour is configured on `<Splitter.Root>`
 * (`keyboardStep`, `disableDoubleClick`, default `aria-label`).
 */
export type SplitterHandleProps = OmitInternalProps<SplitterHandleSlotProps> & {
  /** Accessible label override; defaults to a localized "Resize panes". */
  "aria-label"?: string;
  /** Accessible label via reference; takes precedence over `aria-label`. */
  "aria-labelledby"?: string;
  /** Ref to the handle element. */
  ref?: Ref<HTMLDivElement>;
};
