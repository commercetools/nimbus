import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveInitialSizes } from "../utils";
import type {
  SplitterContextValue,
  SplitterPaneConfig,
} from "../splitter.types";

const COLLAPSE_TOLERANCE = 0.001;

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
  isDoubleClickDisabled: boolean;
  /** When true, the whole splitter is non-interactive. */
  isDisabled: boolean;
  /** Controlled collapsed pane id (or null). When set, collapse is controlled. */
  collapsedPane?: string | null;
  /** Uncontrolled initial collapsed pane id. */
  defaultCollapsedPane?: string | null;
  /** Fired on every size change, including each drag tick. */
  onSizesChange?: (sizes: Record<string, number>) => void;
  /** Fired once when a size interaction settles. */
  onSizesChangeEnd?: (sizes: Record<string, number>) => void;
  /** Fired whenever the collapsed pane changes. */
  onCollapsedPaneChange?: (paneId: string | null) => void;
};

/** True when both ids of a 2-pane order have a finite size in `record`. */
const bothSized = (
  record: Record<string, number> | null | undefined,
  order: string[]
): record is Record<string, number> =>
  !!record &&
  record[order[0]!] !== undefined &&
  record[order[1]!] !== undefined;

/**
 * Owns the sizes state machine for `Splitter.Root`: pane registration, lazy
 * initial-size derivation on mount, controlled/uncontrolled collapse with
 * size reconciliation, and the memoized context value handed to
 * `Splitter.Pane` / `Splitter.Handle`.
 *
 * Sizes carry full float precision end-to-end — no rounding anywhere in this
 * pipeline (the only rounding lives on the handle's `aria-valuenow`, which is
 * an AT announcement and does not affect layout).
 *
 * Two change channels: `setSizes` is the live drag channel (fires
 * `onSizesChange` only); `commitSizes` is the settled channel (fires
 * `onSizesChangeEnd`, the persistence seam). Collapse is plain
 * controlled/uncontrolled state — no imperative API.
 */
export const useSplitterState = (
  options: UseSplitterStateOptions
): SplitterContextValue => {
  const {
    orientation,
    defaultSizes,
    panes,
    keyboardStep,
    isDoubleClickDisabled,
    isDisabled,
    collapsedPane: collapsedPaneProp,
    defaultCollapsedPane,
    onSizesChange,
    onSizesChangeEnd,
    onCollapsedPaneChange,
  } = options;

  // Pane registration: pane order in DOM, and the DOM id rendered on each.
  const [paneOrder, setPaneOrder] = useState<string[]>([]);
  const [paneDomIds, setPaneDomIds] = useState<Record<string, string>>({});

  // Sizes state. Initialized lazily once both panes have registered; the ref
  // mirrors state so settled-commit and collapse reconciliation read the
  // current value synchronously.
  const [sizes, setSizesState] = useState<Record<string, number>>({});
  const sizesRef = useRef<Record<string, number>>(sizes);

  // Mount snapshot for double-click restore; pre-collapse snapshot for expand.
  const initialSizesRef = useRef<Record<string, number>>({});
  const preCollapseSizesRef = useRef<Record<string, number> | null>(null);
  const hasInitializedRef = useRef(false);

  // Collapse: controlled (prop provided) or uncontrolled (internal state).
  const isCollapseControlled = collapsedPaneProp !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState<string | null>(
    defaultCollapsedPane ?? null
  );
  const collapsedPane = isCollapseControlled
    ? (collapsedPaneProp ?? null)
    : internalCollapsed;
  // The collapsed pane whose size effect has already been applied. Lets the
  // reconciliation effect skip when sizes already reflect the collapse state,
  // and lets drag-expand clear collapse without the effect fighting it.
  const appliedCollapseRef = useRef<string | null>(
    defaultCollapsedPane ?? collapsedPaneProp ?? null
  );

  const otherId = useCallback(
    (paneId: string): string | undefined => {
      if (paneOrder.length !== 2) return undefined;
      return paneOrder[0] === paneId ? paneOrder[1] : paneOrder[0];
    },
    [paneOrder]
  );

  // Single low-level size writer. `commit` additionally fires onSizesChangeEnd.
  // Also detects drag-expand: when the collapsed pane grows above its
  // collapsedSize, collapse state is cleared (no size reconcile — sizes are
  // already what the interaction set).
  const writeSizes = useCallback(
    (next: Record<string, number>, opts: { commit: boolean }) => {
      sizesRef.current = next;
      setSizesState(next);
      onSizesChange?.(next);
      if (opts.commit) onSizesChangeEnd?.(next);

      const collapsed = appliedCollapseRef.current;
      if (collapsed) {
        const collapsedSize = panes?.[collapsed]?.collapsedSize ?? 0;
        if ((next[collapsed] ?? 0) > collapsedSize + COLLAPSE_TOLERANCE) {
          appliedCollapseRef.current = null;
          preCollapseSizesRef.current = null;
          if (!isCollapseControlled) setInternalCollapsed(null);
          onCollapsedPaneChange?.(null);
        }
      }
    },
    [
      onSizesChange,
      onSizesChangeEnd,
      panes,
      isCollapseControlled,
      onCollapsedPaneChange,
    ]
  );

  const setSizes = useCallback(
    (next: Record<string, number>) => writeSizes(next, { commit: false }),
    [writeSizes]
  );

  const commitSizes = useCallback(
    (next?: Record<string, number>) => {
      if (next) {
        writeSizes(next, { commit: true });
      } else {
        onSizesChangeEnd?.(sizesRef.current);
      }
    },
    [writeSizes, onSizesChangeEnd]
  );

  // Derive initial sizes once both panes register; apply initial collapse.
  useEffect(() => {
    if (paneOrder.length === 2 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      let initial = deriveInitialSizes(paneOrder, defaultSizes);
      initialSizesRef.current = initial;

      const initCollapsed = collapsedPane;
      if (initCollapsed && paneOrder.includes(initCollapsed)) {
        const other =
          paneOrder[0] === initCollapsed ? paneOrder[1]! : paneOrder[0]!;
        const collapsedSize = panes?.[initCollapsed]?.collapsedSize ?? 0;
        preCollapseSizesRef.current = initial;
        initial = {
          [initCollapsed]: collapsedSize,
          [other]: 100 - collapsedSize,
        };
        appliedCollapseRef.current = initCollapsed;
      }

      sizesRef.current = initial;
      setSizesState(initial);
      // Defaults are read once on mount, per spec — no onSizesChange on mount.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paneOrder]);

  // Reconcile sizes when the resolved collapsed pane changes (controlled prop
  // change or internal toggle). Runs after init so the mount case is a no-op.
  useEffect(() => {
    if (paneOrder.length !== 2 || !hasInitializedRef.current) return;
    const cur = collapsedPane;
    const prev = appliedCollapseRef.current;
    if (cur === prev) return;
    appliedCollapseRef.current = cur;

    if (cur === null) {
      const restore = preCollapseSizesRef.current;
      preCollapseSizesRef.current = null;
      const target = bothSized(restore, paneOrder)
        ? restore
        : initialSizesRef.current;
      if (bothSized(target, paneOrder)) commitSizes(target);
      return;
    }

    const other = otherId(cur);
    if (!other) return;
    if (prev === null) preCollapseSizesRef.current = sizesRef.current;
    const collapsedSize = panes?.[cur]?.collapsedSize ?? 0;
    commitSizes({ [cur]: collapsedSize, [other]: 100 - collapsedSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedPane, paneOrder]);

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

  const setCollapsedPane = useCallback(
    (next: string | null) => {
      if (isDisabled) return;
      if (next === collapsedPane) return;
      if (next !== null && !paneOrder.includes(next)) return;
      if (!isCollapseControlled) setInternalCollapsed(next);
      onCollapsedPaneChange?.(next);
      // Size reconciliation happens in the collapse effect reacting to the
      // resolved collapsedPane change (covers controlled + uncontrolled).
    },
    [
      isDisabled,
      collapsedPane,
      paneOrder,
      isCollapseControlled,
      onCollapsedPaneChange,
    ]
  );

  const restoreDefaults = useCallback(() => {
    if (paneOrder.length !== 2) return;
    const initial = initialSizesRef.current;
    // Existence check (not falsy) so a legitimate 0% initial size restores.
    if (
      initial[paneOrder[0]!] === undefined ||
      initial[paneOrder[1]!] === undefined
    ) {
      return;
    }
    if (collapsedPane !== null) {
      // Only touch internal collapse bookkeeping when uncontrolled. In
      // controlled mode the prop is the source of truth — resetting the refs
      // here would desync them from a prop that hasn't changed yet; instead we
      // just fire the callback so the consumer can clear `collapsedPane`.
      if (!isCollapseControlled) {
        appliedCollapseRef.current = null;
        preCollapseSizesRef.current = null;
        setInternalCollapsed(null);
      }
      onCollapsedPaneChange?.(null);
    }
    commitSizes(initial);
  }, [
    paneOrder,
    collapsedPane,
    isCollapseControlled,
    onCollapsedPaneChange,
    commitSizes,
  ]);

  return useMemo<SplitterContextValue>(
    () => ({
      sizes,
      setSizes,
      commitSizes,
      orientation,
      keyboardStep,
      isDoubleClickDisabled,
      isDisabled,
      getPaneConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsedPane,
      setCollapsedPane,
      restoreDefaults,
    }),
    [
      sizes,
      setSizes,
      commitSizes,
      orientation,
      keyboardStep,
      isDoubleClickDisabled,
      isDisabled,
      getPaneConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsedPane,
      setCollapsedPane,
      restoreDefaults,
    ]
  );
};
