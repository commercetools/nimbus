import type { ReactNode, Ref } from "react";
import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  SplitterRootSlotProps,
  SplitterPaneSlotProps,
  SplitterHandleSlotProps,
} from "./splitter.slots";
import type { SplitterSizeToken } from "./utils/size-tokens";

// ============================================================
// SHARED VALUE TYPES
// ============================================================

/**
 * The role of a pane within a `Splitter`. A splitter is always one configurable
 * `Splitter.Aside` (the pane you size) and one `Splitter.Main` (the pane that
 * takes the remaining space). The role — not an id — designates which pane is
 * which, so the single `size` number always refers to the aside.
 */
export type SplitterPaneRole = "aside" | "main";

/**
 * Aside configuration with defaults applied, as consumed internally by the
 * handle (clamping, ARIA bounds) and the state machine (collapse). Built from
 * the flat `minSize` / `maxSize` / `collapsible` / `collapsedSize` props on
 * `Splitter.Root`.
 *
 * The aside is the only configurable pane: there is one boundary, so the aside's
 * `[minSize, maxSize]` window fully describes it — the main pane's floor is the
 * complement (`100 − maxSize`) and needs no separate knob.
 *
 * @internal
 */
export type ResolvedAsideConfig = {
  /** Aside lower bound (%). */
  minSize: number;
  /** Aside upper bound (%). Caps aside growth; main's floor is `100 − maxSize`. */
  maxSize: number;
  /** Whether the aside can collapse to `collapsedSize`. */
  collapsible: boolean;
  /** Aside size when collapsed (%). */
  collapsedSize: number;
};

/**
 * Internal context shared between `Splitter.Root`, the pane components
 * (`Splitter.Aside` / `Splitter.Main`), and `Splitter.Handle`. Carries the
 * single aside `size`, role-based pane registration, the collapse setter, and
 * the configuration the handle needs to compute its keyboard behavior and ARIA
 * attributes. Produced by `useSplitterState`.
 *
 * @internal
 */
export type SplitterContextValue = {
  /** Aside pane size as a percentage (0–100); main is `100 − size`. Full-precision float. */
  size: number;
  /** Replace the size live (drag ticks). Fires `onSizeChange` only. */
  setSize: (size: number) => void;
  /**
   * Commit a settled size change. With a number (keyboard, collapse, restore)
   * it writes + fires `onSizeChange` and `onSizeChangeEnd`. With no argument
   * (drag end) it fires `onSizeChangeEnd` with the current size only.
   */
  commitSize: (size?: number) => void;
  /** Splitter orientation. Determines layout axis and active arrow keys. */
  orientation: "horizontal" | "vertical";
  /** Keyboard step in percentage points per arrow-key press. Accepts floats. */
  keyboardStep: number;
  /** When true, the handle ignores double-clicks. */
  isDoubleClickDisabled: boolean;
  /** When true, the whole splitter is non-interactive (drag, keyboard, collapse). */
  isDisabled: boolean;

  /** Resolved aside constraints (clamping + ARIA bounds + collapse). */
  asideConfig: ResolvedAsideConfig;

  /** Registered pane roles, in DOM order. */
  paneOrder: SplitterPaneRole[];
  /** Map from pane role to the DOM id rendered on that pane element. */
  paneDomIds: Partial<Record<SplitterPaneRole, string>>;
  /** Register a pane with the splitter under its role. */
  registerPane: (role: SplitterPaneRole, domId: string) => void;
  /** Unregister a pane on unmount. */
  unregisterPane: (role: SplitterPaneRole) => void;

  /** Whether the aside is currently collapsed (resolved controlled/uncontrolled). */
  collapsed: boolean;
  /** Collapse (`true`) or expand (`false`) the aside. Drives size reconciliation. */
  setCollapsed: (collapsed: boolean) => void;
  /** Restore the size derived on mount (double-click). */
  restoreDefaults: () => void;
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for `<Splitter.Root>` — the compound root that owns the single size
 * dimension for its `Splitter.Aside` + `Splitter.Main` children. The aside is
 * the pane you configure; the main pane always takes the remainder.
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
   * Initial size of the **aside** pane as a percentage (0–100). The *dynamic*
   * seed of the splitter's size: read once on mount, and exactly the shape
   * `onSizeChange` / `onSizeChangeEnd` emit — so a persisted value round-trips
   * straight back in here. Subsequent prop changes are ignored; an out-of-range
   * or omitted value falls back to a 50/50 split. The main pane is `100 − size`.
   *
   * For the controlled counterpart, see `size`. Provide one or the other, not both.
   */
  defaultSize?: number;

  /**
   * Controlled size of the **aside** pane as a percentage (0–100). When
   * provided, the splitter is controlled for size: it renders this value and
   * reflects external changes in place (no remount). Control is **settled, not
   * live** — drag and keyboard update the layout smoothly from internal state
   * and notify once per interaction via `onSizeChangeEnd`. Wire `onSizeChangeEnd`
   * and feed the value back to stay controlled — if you don't, the splitter
   * keeps the last interactive value and behaves as uncontrolled from then on
   * (no snap-back). Mutually exclusive with `defaultSize`.
   */
  size?: number;

  /**
   * Aside lower bound as a percentage. Drag/keyboard clamp at this boundary.
   * @default 0
   */
  minSize?: number;

  /**
   * Aside upper bound as a percentage — caps how far the aside can grow. The
   * main pane's floor is the complement (`100 − maxSize`), so this single value
   * bounds both sides of the one boundary.
   * @default 100
   */
  maxSize?: number;

  /**
   * When true, the aside can collapse to `collapsedSize` via Enter on the
   * focused handle or the controlled `collapsed` prop. Only the aside collapses.
   * @default false
   */
  collapsible?: boolean;

  /**
   * Aside size as a percentage when collapsed.
   * @default 0
   */
  collapsedSize?: number;

  /**
   * Notification callback fired on every **resize** update, including each drag
   * tick (~60Hz). Receives the aside size (0–100). For persistence, prefer
   * `onSizeChangeEnd`. Collapse and expand do **not** fire this — they only
   * change the aside's layout and are signalled by `onCollapsedChange`.
   */
  onSizeChange?: (size: number) => void;

  /**
   * Notification callback fired once when a **resize** interaction settles (drag
   * end, each keypress, double-click restore). Receives the aside size (0–100).
   * This is the seam to wire persistence to — no debouncing. Collapse and expand
   * do **not** fire this (they are signalled by `onCollapsedChange`); only a
   * genuine resize does, so feeding the value back into a controlled `size`
   * never restores the collapsed size.
   */
  onSizeChangeEnd?: (size: number) => void;

  /**
   * Controlled collapsed state of the aside. When provided, the splitter is
   * controlled for collapse.
   */
  collapsed?: boolean;

  /**
   * Uncontrolled initial collapsed state of the aside. Used when `collapsed` is
   * not provided.
   * @default false
   */
  defaultCollapsed?: boolean;

  /** Fired whenever the aside collapses (`true`) or expands (`false`). */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Percentage delta applied per arrow-key press on the focused handle.
   * Home/End jump the boundary to the relevant bounds. Accepts floats.
   * @default 5
   */
  keyboardStep?: number;

  /**
   * When true, double-click on the handle does not restore the default size.
   * Drag and keyboard remain active.
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

  /**
   * Exactly one `Splitter.Aside` and one `Splitter.Main` with one
   * `Splitter.Handle` between them. The aside may be placed before or after the
   * main pane (leading or trailing) — `size` always refers to the aside.
   */
  children: ReactNode;

  /** Ref to the root element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for `<Splitter.Aside>` — the configurable pane whose size is driven by
 * `Splitter.Root`'s `size` / `defaultSize`. Carries only its content and an
 * optional `id` (analytics/testing); all sizing and collapse configuration
 * lives on `Splitter.Root`.
 */
export type SplitterAsideProps = OmitInternalProps<SplitterPaneSlotProps> & {
  /** Optional id for the pane element (analytics/testing). Not required. */
  id?: string;

  /** Pane content. */
  children?: ReactNode;

  /** Ref to the pane element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for `<Splitter.Main>` — the primary content pane. It always takes the
 * space the aside does not (`100 − size`) and is never configured directly.
 * Carries only its content and an optional `id` (analytics/testing).
 */
export type SplitterMainProps = OmitInternalProps<SplitterPaneSlotProps> & {
  /** Optional id for the pane element (analytics/testing). Not required. */
  id?: string;

  /** Pane content. */
  children?: ReactNode;

  /** Ref to the pane element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for `<Splitter.Handle>` — the interactive separator between the aside
 * and main panes. The handle takes no per-handle *behaviour* configuration:
 * resize and collapse behaviour is configured on `<Splitter.Root>`
 * (`keyboardStep`, `isDoubleClickDisabled`, `isDisabled`). It accepts standard
 * DOM attributes (`id`, `className`, `data-*`) via the slot, and `aria-label` /
 * `aria-labelledby` to override the localized default ("Resize panes").
 */
export type SplitterHandleProps = OmitInternalProps<SplitterHandleSlotProps> & {
  /** Accessible label override; defaults to a localized "Resize panes". */
  "aria-label"?: string;
  /** Accessible label via reference; takes precedence over `aria-label`. */
  "aria-labelledby"?: string;
  /** Ref to the handle element. */
  ref?: Ref<HTMLDivElement>;
};

// ============================================================
// useResponsiveSplitterSizes — companion hook types
// ============================================================

/**
 * A single size value for the `useResponsiveSplitterSizes` hook. **A bare
 * `number` is always pixels** — the hook exists to let consumers think in
 * pixels and translates to the percentage `Splitter.Root` consumes. The three
 * forms:
 *
 * - `number` — pixels (e.g. `320` → `320px`), converted against the measured
 *   container.
 * - {@link SplitterSizeToken} — a size token (`3xs`–`8xl`, `breakpoint-*`)
 *   resolving to pixels, then converted.
 * - `` `${number}%` `` — a percentage, passed through to the component
 *   untranslated (no measurement needed).
 *
 * Contrast with `Splitter.Root`'s own `size`/`minSize`/… props, which are
 * percentages: through the hook a bare number is pixels.
 */
export type ResponsiveSplitterSizeValue =
  number | SplitterSizeToken | `${number}%`;

/**
 * A container **min-width threshold** key for a responsive size map. A threshold
 * is a pixel `number` or a size token (resolving to pixels) — never a
 * percentage (a percentage threshold of the container against itself is
 * meaningless).
 */
export type ResponsiveSplitterSizeThreshold = number | SplitterSizeToken;

/**
 * A size configuration for one dimension. Either a single value (applies at
 * every width) or a map keyed by container min-width thresholds — a min-width
 * cascade resolved against the splitter's **own** measured width (not the
 * viewport). The largest threshold `≤` the measured width wins; the smallest
 * entry also applies below it.
 *
 * @example
 * 320                                  // 320px at every width
 * "30%"                                // 30% at every width
 * { 0: 320, 768: "30%", "breakpoint-lg": 400 } // px → %, by container width
 */
export type ResponsiveSplitterSizeConfig =
  | ResponsiveSplitterSizeValue
  | Partial<
      Record<ResponsiveSplitterSizeThreshold, ResponsiveSplitterSizeValue>
    >;

/**
 * Minimal `localStorage`-like interface the hook persists through. Injectable so
 * persistence can be redirected (tests, app-scoped stores) or disabled.
 */
export type SplitterSizesStorage = {
  /** Read a previously stored payload string, or `null`. May be wrapped to never throw. */
  getItem: (key: string) => string | null;
  /** Write a payload string. May be wrapped to never throw. */
  setItem: (key: string, value: string) => void;
};

/**
 * Options for {@link useResponsiveSplitterSizes}.
 */
export type UseResponsiveSplitterSizesOptions = {
  /**
   * Splitter orientation — selects the measured axis (width for `"horizontal"`,
   * height for `"vertical"`) and is forwarded to `Splitter.Root`.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /** Aside size config (pixels/token/percent, single value or per-threshold map). */
  size: ResponsiveSplitterSizeConfig;

  /** Aside lower bound (pixels/token/percent). Translated to a percentage and forwarded. */
  minSize?: ResponsiveSplitterSizeConfig;
  /** Aside upper bound (pixels/token/percent). Translated to a percentage and forwarded. */
  maxSize?: ResponsiveSplitterSizeConfig;
  /** Aside collapsed size (pixels/token/percent). Static config — never persisted. */
  collapsedSize?: ResponsiveSplitterSizeConfig;

  /** Storage key for persistence. When omitted, sizes are not persisted. */
  persistKey?: string;
  /** Storage adapter. Defaults to a `localStorage` wrapper that never throws. */
  storage?: SplitterSizesStorage;

  /**
   * Optional passthrough for collapse changes. The hook always wires its own
   * `onCollapsedChange` (to suppress persistence while collapsed); this is
   * invoked in addition so consumers can observe collapse too.
   */
  onCollapsedChange?: (collapsed: boolean) => void;
};

/**
 * Props produced by {@link useResponsiveSplitterSizes} to spread onto
 * `Splitter.Root`. All sizes are percentages (the component's native unit);
 * `size` may be absent for one frame before the container is first measured
 * with a pixel/token config.
 */
export type ResponsiveSplitterRootProps = {
  /** Controlled aside size (percentage). Absent until resolvable for px/token configs. */
  size?: number;
  /** Aside lower bound (percentage). Present only when `minSize` was configured + resolved. */
  minSize?: number;
  /** Aside upper bound (percentage). Present only when `maxSize` was configured + resolved. */
  maxSize?: number;
  /** Aside collapsed size (percentage). Present only when `collapsedSize` was configured + resolved. */
  collapsedSize?: number;
  /** Settle handler — persists and feeds the value back to keep the loop closed. */
  onSizeChangeEnd: (size: number) => void;
  /** Collapse tracker (also calls the optional `onCollapsedChange` option). */
  onCollapsedChange: (collapsed: boolean) => void;
  /** Ref that attaches the container `ResizeObserver`. Required for px/token/responsive resolution. */
  ref: Ref<HTMLDivElement>;
  /** Forwarded orientation. */
  orientation: "horizontal" | "vertical";
};

/** Return value of {@link useResponsiveSplitterSizes}. */
export type UseResponsiveSplitterSizesResult = {
  /** Spread onto `Splitter.Root`. */
  rootProps: ResponsiveSplitterRootProps;
};
