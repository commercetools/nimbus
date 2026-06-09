import type { ReactNode, Ref } from "react";
import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  SplitterRootSlotProps,
  SplitterPaneSlotProps,
  SplitterHandleSlotProps,
} from "./splitter.slots";

// ============================================================
// SHARED VALUE TYPES
// ============================================================

/**
 * Static, per-pane configuration on `Splitter.Root`'s `panes` map. All settings
 * are keyed by the pane's `id` (matching the `id` on each `<Splitter.Pane>`) and
 * are fixed structural config — the dynamic proportions live in `defaultSizes`.
 *
 * A 2-pane splitter has a single boundary, so the only genuinely per-pane
 * settings are the lower bound and collapsibility. The upper bound is not a
 * per-pane knob — it is derived from the partner pane's `minSize`
 * (`max = 100 − partner.minSize`).
 */
export type SplitterPaneConfig = {
  /** Minimum allowed percentage; drag/keyboard clamps at this boundary. Defaults to 0. Accepts floats. */
  minSize?: number;
  /** When true, the pane can collapse to `collapsedSize` via Enter or the controlled `collapsedPane` prop. */
  collapsible?: boolean;
  /** Percentage size when the pane is collapsed. Defaults to 0. Accepts floats. */
  collapsedSize?: number;
};

/**
 * Internal context shared between `Splitter.Root`, `Splitter.Pane`, and
 * `Splitter.Handle`. Carries the id-keyed sizes record, pane registration, the
 * collapse setter, and the configuration the handle needs to compute its
 * keyboard behavior and ARIA attributes. Produced by `useSplitterState`.
 *
 * @internal
 */
export type SplitterContextValue = {
  /** Current sizes record, keyed by pane id, summing to 100. Values are full-precision floats. */
  sizes: Record<string, number>;
  /** Replace the sizes record live (drag ticks). Fires `onSizesChange` only. */
  setSizes: (sizes: Record<string, number>) => void;
  /**
   * Commit a settled size change. With a record (keyboard, collapse, restore)
   * it writes + fires `onSizesChange` and `onSizesChangeEnd`. With no argument
   * (drag end) it fires `onSizesChangeEnd` with the current sizes only.
   */
  commitSizes: (sizes?: Record<string, number>) => void;
  /** Splitter orientation. Determines layout axis and active arrow keys. */
  orientation: "horizontal" | "vertical";
  /** Keyboard step in percentage points per arrow-key press. Accepts floats. */
  keyboardStep: number;
  /** When true, the handle ignores double-clicks. */
  isDoubleClickDisabled: boolean;
  /** When true, the whole splitter is non-interactive (drag, keyboard, collapse). */
  isDisabled: boolean;

  /** Look up the configuration for a given pane id. */
  getPaneConfig: (paneId: string) => SplitterPaneConfig;

  /** Ordered ids of the two registered panes, in DOM order. */
  paneOrder: string[];
  /** Map from pane id to the DOM id rendered on the pane element. */
  paneDomIds: Record<string, string>;
  /** Register a pane with the splitter. Returns a stable DOM id. */
  registerPane: (paneId: string, domId: string) => void;
  /** Unregister a pane on unmount. */
  unregisterPane: (paneId: string) => void;

  /** The currently collapsed pane id (resolved controlled/uncontrolled), or null. */
  collapsedPane: string | null;
  /** Set the collapsed pane (null = none). Drives controlled/uncontrolled collapse + size reconciliation. */
  setCollapsedPane: (paneId: string | null) => void;
  /** Restore the boundary to the sizes derived on mount (double-click). */
  restoreDefaults: () => void;
};

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
   * Visual thickness of the handle's track (seen on hover/focus). The standard
   * recipe `size` dimension (the second axis alongside `variant`). Note this is
   * the singular `size` — it sizes the handle; the plural `defaultSizes` /
   * `onSizesChange` carry the pane proportions.
   * @default "md"
   */
  size?: SplitterRootSlotProps["size"];

  /**
   * Initial pane proportions, keyed by pane id, summing to 100. This is the
   * *dynamic* seed of the splitter's size state: it is read once on mount, and
   * its `Record<id, number>` shape is exactly what `onSizesChange` /
   * `onSizesChangeEnd` emit — so a persisted value round-trips straight back in
   * here (read in `onSizesChangeEnd`, store, hydrate `defaultSizes`). Subsequent
   * prop changes are ignored; normalized to 100 with full float precision
   * preserved. When omitted, falls back to a 50/50 split.
   *
   * Static, non-persisted per-pane configuration (`minSize`, `collapsible`,
   * `collapsedSize`) lives separately in `panes`, keyed by the same ids.
   *
   * For the controlled counterpart (drive sizes from outside and reflect
   * external changes in place), see `sizes`. Provide one or the other, not both.
   */
  defaultSizes?: Record<string, number>;

  /**
   * Controlled pane proportions, keyed by pane id (normalized to sum 100). When
   * provided, the splitter is controlled for size: it renders these proportions
   * and reflects external changes in place (no remount). Control is **settled,
   * not live** — drag and keyboard update the layout smoothly from internal
   * state and notify once per interaction via `onSizesChangeEnd`; there is no
   * per-tick feedback requirement. Wire `onSizesChangeEnd` and feed the value
   * back to stay controlled — if you don't, the splitter keeps the last
   * interactive value and behaves as uncontrolled from then on (no snap-back).
   *
   * Mutually exclusive with `defaultSizes`. Inbound values are normalized to
   * sum 100 but not clamped to `minSize` (the next interaction re-clamps).
   */
  sizes?: Record<string, number>;

  /**
   * Notification callback fired on every size change, including each drag tick
   * (~60Hz). Receives the post-change sizes record (sums to 100). For
   * persistence, prefer `onSizesChangeEnd`.
   */
  onSizesChange?: (sizes: Record<string, number>) => void;

  /**
   * Notification callback fired once when a size interaction settles (drag end,
   * each keypress, collapse/expand, double-click restore). This is the seam to
   * wire persistence to — no debouncing required.
   */
  onSizesChangeEnd?: (sizes: Record<string, number>) => void;

  /**
   * Static, per-pane configuration keyed by the pane's `id`. Everything here
   * (`minSize`, `collapsible`, `collapsedSize`) is structural and does not
   * change at runtime — which is why it is separate from `defaultSizes` (the
   * dynamic, persisted proportions). `collapsedSize` is a percentage but is
   * still config, not live state, so it lives here rather than in
   * `defaultSizes`. Nothing leaks onto `<Splitter.Pane>`.
   */
  panes?: Record<string, SplitterPaneConfig>;

  /**
   * Controlled collapsed pane: the id of the pane that is currently collapsed,
   * or `null` for none. A 2-pane splitter collapses at most one pane at a time.
   * When provided, the splitter is controlled for collapse state.
   */
  collapsedPane?: string | null;

  /**
   * Uncontrolled initial collapsed pane. Used when `collapsedPane` is not
   * provided.
   * @default null
   */
  defaultCollapsedPane?: string | null;

  /** Fired whenever the collapsed pane changes (collapse, expand, or toggle). */
  onCollapsedPaneChange?: (paneId: string | null) => void;

  /**
   * Percentage delta applied per arrow-key press on the focused handle.
   * Home/End jump the boundary to the relevant bounds. Accepts floats.
   * @default 5
   */
  keyboardStep?: number;

  /**
   * When true, double-click on the handle does not restore defaults. Drag and
   * keyboard remain active.
   * @default false
   */
  isDoubleClickDisabled?: boolean;

  /**
   * When true, the splitter is non-interactive: the handle is removed from the
   * tab order (`tabIndex={-1}`), gets `aria-disabled`, and ignores drag,
   * keyboard, and collapse input.
   * @default false
   */
  isDisabled?: boolean;

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
 * panes. The handle takes no per-handle *behaviour* configuration: resize and
 * collapse behaviour is configured on `<Splitter.Root>` (`keyboardStep`,
 * `isDoubleClickDisabled`, `isDisabled`). It still accepts standard DOM and
 * style props via the slot — notably an `id` (e.g. a persistent id for
 * analytics) and `aria-label` / `aria-labelledby` to override the localized
 * default ("Resize panes").
 */
export type SplitterHandleProps = OmitInternalProps<SplitterHandleSlotProps> & {
  /** Accessible label override; defaults to a localized "Resize panes". */
  "aria-label"?: string;
  /** Accessible label via reference; takes precedence over `aria-label`. */
  "aria-labelledby"?: string;
  /** Ref to the handle element. */
  ref?: Ref<HTMLDivElement>;
};
