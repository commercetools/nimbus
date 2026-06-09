import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveInitialSizes, normalizeSizes, sizesEqual } from "../utils";
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
  /** Controlled id-keyed sizes (settle-only). When set, sizes are controlled. */
  sizes?: Record<string, number>;
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
    sizes: sizesProp,
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

  // Sizes: controlled (prop provided) or uncontrolled (internal state). Control
  // is settle-only — internal `sizes` stays authoritative during interaction;
  // the prop is reconciled in at rest by the effect below.
  const isSizesControlled = sizesProp !== undefined;
  // The controlled value the reconcile effect last acted on. Gates the effect
  // against the *prop* changing, independent of internal drift.
  const lastReconciledSizesRef = useRef<Record<string, number> | null>(null);
  const didWarnControlledSizesRef = useRef(false);

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
  // and lets an expand-by-resize clear collapse without the effect fighting it.
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
  // Also detects expand-by-resize: when the collapsed pane grows above its
  // collapsedSize (e.g. a controlled double-click restore writes the initial
  // sizes), collapse state is cleared — no size reconcile, the sizes are already
  // what the interaction set. (Resizing is locked while collapsed, so this is
  // reached via restore, not drag.)
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
      // Controlled `sizes` seeds the initial layout when present + valid; else
      // the uncontrolled `defaultSizes` path (with its 50/50 fallback).
      let initial =
        (isSizesControlled && normalizeSizes(sizesProp, paneOrder)) ||
        deriveInitialSizes(paneOrder, defaultSizes);
      initialSizesRef.current = initial;
      // Seed against the raw prop so the reconcile effect's first run is a no-op.
      lastReconciledSizesRef.current = sizesProp ?? null;

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

  // Reconcile a controlled `sizes` prop into internal state at rest. Internal
  // `sizes` stays the render source and the authority DURING interaction; this
  // runs only when the PROP changes (the settle seam), never on a drag tick.
  // Declared after the collapse effect so collapse (owner of appliedCollapseRef
  // / preCollapseSizesRef) settles first when both change in one commit. The
  // write is silent (no onSizesChange/End) — the value is the consumer's own,
  // not a user interaction, mirroring how mount-time sizes don't fire callbacks.
  useEffect(() => {
    if (!isSizesControlled) return;
    if (paneOrder.length !== 2 || !hasInitializedRef.current) return;
    // Prop unchanged since last reconcile → nothing to do. Covers the post-init
    // no-op and the "consumer never feeds the value back" case (no snap-back).
    if (sizesEqual(sizesProp, lastReconciledSizesRef.current)) return;

    const normalized = normalizeSizes(sizesProp, paneOrder);
    if (!normalized) return; // malformed input → ignore, keep internal state
    lastReconciledSizesRef.current = sizesProp ?? null;

    // Collapse owns the collapsed pane's size. While collapsed, don't overwrite
    // the collapsed layout — stash the controlled value as the expand target so
    // a later expand restores it.
    if (collapsedPane !== null) {
      preCollapseSizesRef.current = normalized;
      return;
    }

    // Internal already matches (e.g. consumer fed back the emitted value) → no
    // write. `sizes` is not a dep, so a silent write can't re-trigger this.
    if (sizesEqual(normalized, sizesRef.current)) return;
    sizesRef.current = normalized;
    setSizesState(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizesProp, paneOrder, collapsedPane]);

  // Dev-time guidance on controlled-`sizes` misuse. Fires at most once.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (didWarnControlledSizesRef.current || !isSizesControlled) return;
    if (defaultSizes !== undefined) {
      didWarnControlledSizesRef.current = true;
      console.warn(
        "[Splitter] Both `sizes` (controlled) and `defaultSizes` (uncontrolled) were provided. `defaultSizes` is ignored — pass one or the other."
      );
    } else if (onSizesChangeEnd === undefined) {
      didWarnControlledSizesRef.current = true;
      console.warn(
        "[Splitter] `sizes` is controlled but `onSizesChangeEnd` is not set. After a drag or keyboard resize the splitter keeps that value and behaves as uncontrolled. Wire `onSizesChangeEnd` and feed the value back to stay controlled."
      );
    }
  }, [isSizesControlled, defaultSizes, onSizesChangeEnd]);

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
