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
   * Notification callback fired on every size change, including each drag tick
   * (~60Hz). Receives the aside size (0–100). For persistence, prefer
   * `onSizeChangeEnd`.
   */
  onSizeChange?: (size: number) => void;

  /**
   * Notification callback fired once when a size interaction settles (drag end,
   * each keypress, collapse/expand, double-click restore). Receives the aside
   * size (0–100). This is the seam to wire persistence to — no debouncing.
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
 * (`keyboardStep`, `isDoubleClickDisabled`, `isDisabled`). It still accepts
 * standard DOM and style props via the slot — notably an `id` (e.g. a persistent
 * id for analytics) and `aria-label` / `aria-labelledby` to override the
 * localized default ("Resize panes").
 */
export type SplitterHandleProps = OmitInternalProps<SplitterHandleSlotProps> & {
  /** Accessible label override; defaults to a localized "Resize panes". */
  "aria-label"?: string;
  /** Accessible label via reference; takes precedence over `aria-label`. */
  "aria-labelledby"?: string;
  /** Ref to the handle element. */
  ref?: Ref<HTMLDivElement>;
};
