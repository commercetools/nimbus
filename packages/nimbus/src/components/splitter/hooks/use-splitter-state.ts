import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { deriveInitialSizes } from "../utils";
import type {
  SplitterContextValue,
  SplitterImperativeHandle,
  SplitterPaneConfig,
} from "../splitter.types";

const SUM_TOLERANCE = 0.001;

type UseSplitterStateOptions = {
  /** Splitter orientation; determines layout axis and active arrow keys. */
  orientation: "horizontal" | "vertical";
  /** Explicit id-keyed initial sizes (read once on mount). */
  defaultSizes?: Record<string, number>;
  /** Per-pane configuration map, keyed by pane id. */
  panes?: Record<string, SplitterPaneConfig>;
  /** Keyboard step in percentage points per arrow-key press. */
  keyboardStep: number;
  /** When true, the handle ignores double-clicks. */
  disableDoubleClick: boolean;
  /** Fired on every size change (drag, keyboard, collapse, imperative). */
  onSizesChange?: (sizes: Record<string, number>) => void;
  /** Fired when a collapsible pane transitions to its `collapsedSize`. */
  onCollapse?: (paneId: string) => void;
  /** Fired when a collapsed pane transitions back above its `collapsedSize`. */
  onExpand?: (paneId: string) => void;
  /** Imperative ref `useSplitterLayout` attaches its command surface to. */
  layoutRef?: React.RefObject<SplitterImperativeHandle | null>;
};

/**
 * Owns the entire sizes state machine for `Splitter.Root`: pane registration,
 * lazy initial-size derivation on mount, collapse/expand transition detection,
 * the imperative command surface consumed by `useSplitterLayout`, and the
 * memoized context value handed to `Splitter.Pane` / `Splitter.Handle`.
 *
 * Kept separate from the Root component so the component body stays a thin
 * provider; all coordination logic lives here.
 *
 * @param options - Root configuration (orientation, defaults, per-pane config,
 *   keyboard step, collapse callbacks, and the imperative layout ref).
 * @returns The `SplitterContextValue` to provide to the splitter subtree.
 *
 * @example
 * const ctx = useSplitterState({
 *   orientation: "horizontal",
 *   keyboardStep: 5,
 *   disableDoubleClick: false,
 *   panes: { nav: { minSize: 10 }, main: { minSize: 20 } },
 * });
 */
export const useSplitterState = (
  options: UseSplitterStateOptions
): SplitterContextValue => {
  const {
    orientation,
    defaultSizes,
    panes,
    keyboardStep,
    disableDoubleClick,
    onSizesChange,
    onCollapse,
    onExpand,
    layoutRef,
  } = options;

  // Pane registration: pane order in DOM, and the DOM id rendered on each.
  const [paneOrder, setPaneOrder] = useState<string[]>([]);
  const [paneDomIds, setPaneDomIds] = useState<Record<string, string>>({});

  // Sizes state. We initialize lazily once both panes have registered so the
  // initial-sizes derivation has the right ids; intermediate renders return
  // empty sizes (panes fall back to 0%) — this happens for at most one paint.
  const [sizes, setSizesState] = useState<Record<string, number>>({});

  // Remember the sizes resolved on mount so double-click can restore them.
  // Per spec, defaults are read once on mount; this ref captures that snapshot.
  const initialSizesRef = useRef<Record<string, number>>({});

  // Re-run initial sizes derivation when the pane set changes (mount).
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (paneOrder.length === 2 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const initial = deriveInitialSizes(paneOrder, defaultSizes, panes);
      initialSizesRef.current = initial;
      setSizesState(initial);
    }
    // Defaults are read once on mount, per spec — don't react to changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paneOrder]);

  // Track collapsed state per pane so onCollapse/onExpand fire on transitions.
  const collapsedRef = useRef<Record<string, boolean>>({});

  const setSizes = useCallback(
    (next: Record<string, number>) => {
      const prevSizes = sizes;
      setSizesState(next);

      // Detect collapse/expand transitions and fire callbacks once per change.
      for (const id of Object.keys(next)) {
        const cfg = panes?.[id];
        if (!cfg?.collapsible) continue;
        const collapsedSize = cfg.collapsedSize ?? 0;
        const wasCollapsed =
          collapsedRef.current[id] ??
          (prevSizes[id] !== undefined &&
            prevSizes[id]! <= collapsedSize + SUM_TOLERANCE);
        const isNowCollapsed = next[id]! <= collapsedSize + SUM_TOLERANCE;
        if (!wasCollapsed && isNowCollapsed) {
          onCollapse?.(id);
        } else if (wasCollapsed && !isNowCollapsed) {
          onExpand?.(id);
        }
        collapsedRef.current[id] = isNowCollapsed;
      }

      onSizesChange?.(next);
    },
    [sizes, panes, onSizesChange, onCollapse, onExpand]
  );

  const registerPane = useCallback((paneId: string, domId: string) => {
    setPaneOrder((order) =>
      order.includes(paneId) ? order : [...order, paneId]
    );
    setPaneDomIds((map) =>
      map[paneId] === domId ? map : { ...map, [paneId]: domId }
    );
  }, []);

  const unregisterPane = useCallback((paneId: string) => {
    setPaneOrder((order) => order.filter((id) => id !== paneId));
    setPaneDomIds((map) => {
      if (!(paneId in map)) return map;
      const next = { ...map };
      delete next[paneId];
      return next;
    });
  }, []);

  const getPaneConfig = useCallback(
    (paneId: string): SplitterPaneConfig => panes?.[paneId] ?? {},
    [panes]
  );

  const isCollapsedFn = useCallback(
    (paneId: string): boolean => {
      const cfg = panes?.[paneId];
      if (!cfg?.collapsible) return false;
      const collapsedSize = cfg.collapsedSize ?? 0;
      return (sizes[paneId] ?? 0) <= collapsedSize + SUM_TOLERANCE;
    },
    [panes, sizes]
  );

  const collapsePane = useCallback(
    (paneId: string) => {
      if (paneOrder.length !== 2) return;
      const otherId = paneOrder[0] === paneId ? paneOrder[1]! : paneOrder[0]!;
      const cfg = panes?.[paneId];
      if (!cfg?.collapsible) return;
      const collapsedSize = cfg.collapsedSize ?? 0;
      // Collapse semantics dominate the other pane's drag-time maxSize: the
      // collapsing pane lands on `collapsedSize`, and the other pane absorbs
      // the freed space. If a consumer configures `otherMax < 100 -
      // collapsedSize` the other pane will momentarily sit above its
      // drag-time max — that's strictly better than failing the collapse
      // outright (which would leave `isCollapsed()` false and skip the
      // `onCollapse` callback).
      setSizes({ [paneId]: collapsedSize, [otherId]: 100 - collapsedSize });
    },
    [paneOrder, panes, setSizes]
  );

  const expandPane = useCallback(
    (paneId: string) => {
      if (paneOrder.length !== 2) return;
      const otherId = paneOrder[0] === paneId ? paneOrder[1]! : paneOrder[0]!;
      const cfg = panes?.[paneId];
      const restoreTo = cfg?.defaultSize ?? defaultSizes?.[paneId] ?? 50;
      setSizes({ [paneId]: restoreTo, [otherId]: 100 - restoreTo });
    },
    [paneOrder, panes, defaultSizes, setSizes]
  );

  const restoreDefaults = useCallback(() => {
    if (paneOrder.length !== 2) return;
    const initial = initialSizesRef.current;
    if (!initial[paneOrder[0]!] || !initial[paneOrder[1]!]) return;
    setSizes(initial);
  }, [paneOrder, setSizes]);

  // Expose imperative commands to `useSplitterLayout` via the internal ref.
  useImperativeHandle(
    layoutRef,
    (): SplitterImperativeHandle => ({
      setSizes,
      getSizes: () => sizes,
      collapse: collapsePane,
      expand: expandPane,
      isCollapsed: isCollapsedFn,
    }),
    [setSizes, sizes, collapsePane, expandPane, isCollapsedFn]
  );

  return useMemo<SplitterContextValue>(
    () => ({
      sizes,
      setSizes,
      orientation,
      keyboardStep,
      disableDoubleClick,
      getPaneConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsePane,
      expandPane,
      isCollapsed: isCollapsedFn,
      restoreDefaults,
    }),
    [
      sizes,
      setSizes,
      orientation,
      keyboardStep,
      disableDoubleClick,
      getPaneConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsePane,
      expandPane,
      isCollapsedFn,
      restoreDefaults,
    ]
  );
};
