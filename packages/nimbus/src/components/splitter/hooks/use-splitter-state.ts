import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveInitialSize, normalizeSize, sizeEqual } from "../utils";
import type {
  ResolvedAsideConfig,
  SplitterContextValue,
  SplitterPaneRole,
} from "../splitter.types";

const COLLAPSE_TOLERANCE = 0.001;

type UseSplitterStateOptions = {
  /** Splitter orientation; determines layout axis and active arrow keys. */
  orientation: "horizontal" | "vertical";
  /** Explicit initial aside size (read once on mount). */
  defaultSize?: number;
  /** Controlled aside size (settle-only). When set, size is controlled. */
  size?: number;
  /** Resolved aside constraints (clamping, collapse). */
  asideConfig: ResolvedAsideConfig;
  /** Keyboard step in percentage points per arrow-key press. */
  keyboardStep: number;
  /** When true, the handle ignores double-clicks. */
  isDoubleClickDisabled: boolean;
  /** When true, the whole splitter is non-interactive. */
  isDisabled: boolean;
  /** Controlled collapsed state of the aside. When set, collapse is controlled. */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. */
  defaultCollapsed?: boolean;
  /** Fired on every size change, including each drag tick. */
  onSizeChange?: (size: number) => void;
  /** Fired once when a size interaction settles. */
  onSizeChangeEnd?: (size: number) => void;
  /** Fired whenever the aside collapses or expands. */
  onCollapsedChange?: (collapsed: boolean) => void;
};

/** True once both the aside and main panes have registered. */
const bothRegistered = (order: SplitterPaneRole[]): boolean =>
  order.includes("aside") && order.includes("main");

/**
 * Owns the size state machine for `Splitter.Root`: role-based pane registration,
 * lazy initial-size derivation on mount, controlled/uncontrolled collapse of the
 * aside with size reconciliation, and the memoized context value handed to the
 * pane components and `Splitter.Handle`.
 *
 * The single source of truth is the aside's `size` (%); the main pane is always
 * `100 − size`. Sizes carry full float precision end-to-end — no rounding
 * anywhere in this pipeline (the only rounding lives on the handle's
 * `aria-valuenow`, an AT announcement that does not affect layout).
 *
 * Two change channels: `setSize` is the live drag channel (fires `onSizeChange`
 * only); `commitSize` is the settled channel (fires `onSizeChangeEnd`, the
 * persistence seam). Collapse is plain controlled/uncontrolled boolean state.
 */
export const useSplitterState = (
  options: UseSplitterStateOptions
): SplitterContextValue => {
  const {
    orientation,
    defaultSize,
    size: sizeProp,
    asideConfig,
    keyboardStep,
    isDoubleClickDisabled,
    isDisabled,
    collapsed: collapsedProp,
    defaultCollapsed,
    onSizeChange,
    onSizeChangeEnd,
    onCollapsedChange,
  } = options;

  // Pane registration: role order in DOM, and the DOM id rendered on each.
  const [paneOrder, setPaneOrder] = useState<SplitterPaneRole[]>([]);
  const [paneDomIds, setPaneDomIds] = useState<
    Partial<Record<SplitterPaneRole, string>>
  >({});

  // Aside size state. Initialized lazily once both panes have registered; the
  // ref mirrors state so settled-commit and collapse reconciliation read the
  // current value synchronously.
  const [size, setSizeState] = useState<number>(50);
  const sizeRef = useRef<number>(size);

  // Size: controlled (prop provided) or uncontrolled (internal state). Control
  // is settle-only — internal `size` stays authoritative during interaction; the
  // prop is reconciled in at rest by the effect below.
  const isSizeControlled = sizeProp !== undefined;
  // The controlled value the reconcile effect last acted on. Gates the effect
  // against the *prop* changing, independent of internal drift.
  const lastReconciledSizeRef = useRef<number | null>(null);
  const didWarnControlledSizeRef = useRef(false);

  // Mount snapshot for double-click restore; pre-collapse snapshot for expand.
  const initialSizeRef = useRef<number>(50);
  const preCollapseSizeRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  // Collapse: controlled (prop provided) or uncontrolled (internal state).
  const isCollapseControlled = collapsedProp !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(
    defaultCollapsed ?? false
  );
  const collapsed = isCollapseControlled
    ? (collapsedProp ?? false)
    : internalCollapsed;
  // Whether the size state already reflects the collapse state. Lets the
  // reconciliation effect skip when sizes already match, and lets an
  // expand-by-resize clear collapse without the effect fighting it.
  const appliedCollapseRef = useRef<boolean>(
    defaultCollapsed ?? collapsedProp ?? false
  );

  // Single low-level size writer. `commit` additionally fires onSizeChangeEnd.
  // Also detects expand-by-resize: if the aside grows past its collapsedSize
  // (e.g. a double-click restore), collapse state is cleared.
  const writeSize = useCallback(
    (next: number, opts: { commit: boolean }) => {
      sizeRef.current = next;
      setSizeState(next);
      onSizeChange?.(next);
      if (opts.commit) onSizeChangeEnd?.(next);

      if (
        appliedCollapseRef.current &&
        next > asideConfig.collapsedSize + COLLAPSE_TOLERANCE
      ) {
        appliedCollapseRef.current = false;
        preCollapseSizeRef.current = null;
        if (!isCollapseControlled) setInternalCollapsed(false);
        onCollapsedChange?.(false);
      }
    },
    [
      onSizeChange,
      onSizeChangeEnd,
      asideConfig.collapsedSize,
      isCollapseControlled,
      onCollapsedChange,
    ]
  );

  const setSize = useCallback(
    (next: number) => writeSize(next, { commit: false }),
    [writeSize]
  );

  const commitSize = useCallback(
    (next?: number) => {
      if (next !== undefined) {
        writeSize(next, { commit: true });
      } else {
        onSizeChangeEnd?.(sizeRef.current);
      }
    },
    [writeSize, onSizeChangeEnd]
  );

  // Derive initial size once both panes register; apply initial collapse.
  useEffect(() => {
    if (bothRegistered(paneOrder) && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Controlled `size` seeds the initial layout when present + valid; else
      // the uncontrolled `defaultSize` path (with its 50/50 fallback).
      const controlledInitial = isSizeControlled
        ? normalizeSize(sizeProp)
        : null;
      let initial = controlledInitial ?? deriveInitialSize(defaultSize);
      initialSizeRef.current = initial;
      // Seed against the raw prop so the reconcile effect's first run is a no-op.
      lastReconciledSizeRef.current = sizeProp ?? null;

      if (collapsed && asideConfig.collapsible) {
        preCollapseSizeRef.current = initial;
        initial = asideConfig.collapsedSize;
        appliedCollapseRef.current = true;
      } else {
        appliedCollapseRef.current = false;
      }

      sizeRef.current = initial;
      setSizeState(initial);
      // Defaults are read once on mount, per spec — no onSizeChange on mount.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paneOrder]);

  // Reconcile size when the resolved collapsed state changes (controlled prop
  // change or internal toggle). Runs after init so the mount case is a no-op.
  useEffect(() => {
    if (!bothRegistered(paneOrder) || !hasInitializedRef.current) return;
    const cur = collapsed;
    const prev = appliedCollapseRef.current;
    if (cur === prev) return;
    // Can't collapse a non-collapsible aside — leave the layout, stay a no-op.
    if (cur && !asideConfig.collapsible) return;
    appliedCollapseRef.current = cur;

    if (cur) {
      if (!prev) preCollapseSizeRef.current = sizeRef.current;
      commitSize(asideConfig.collapsedSize);
    } else {
      const restore = preCollapseSizeRef.current;
      preCollapseSizeRef.current = null;
      commitSize(restore ?? initialSizeRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, paneOrder]);

  // Reconcile a controlled `size` prop into internal state at rest — only when
  // the prop changes, never on a drag tick (internal state stays authoritative
  // during interaction). Declared after the collapse effect so collapse settles
  // first. The write is silent (no callbacks): the value is the consumer's own.
  useEffect(() => {
    if (!isSizeControlled) return;
    if (!bothRegistered(paneOrder) || !hasInitializedRef.current) return;
    // Prop unchanged since last reconcile → nothing to do. Covers the post-init
    // no-op and the "consumer never feeds the value back" case (no snap-back).
    if (sizeEqual(sizeProp, lastReconciledSizeRef.current)) return;

    const normalized = normalizeSize(sizeProp);
    if (normalized === null) return; // malformed input → ignore, keep state
    lastReconciledSizeRef.current = sizeProp ?? null;

    // Collapse owns the aside's size. While collapsed, don't overwrite the
    // collapsed layout — stash the controlled value as the expand target so a
    // later expand restores it.
    if (collapsed) {
      preCollapseSizeRef.current = normalized;
      return;
    }

    // Internal already matches (e.g. consumer fed back the emitted value) → no
    // write. `size` is not a dep, so a silent write can't re-trigger this.
    if (sizeEqual(normalized, sizeRef.current)) return;
    sizeRef.current = normalized;
    setSizeState(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeProp, paneOrder, collapsed]);

  // Dev-time guidance on controlled-`size` misuse. Fires at most once.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (didWarnControlledSizeRef.current || !isSizeControlled) return;
    if (defaultSize !== undefined) {
      didWarnControlledSizeRef.current = true;
      console.warn(
        "[Splitter] Both `size` (controlled) and `defaultSize` (uncontrolled) were provided. `defaultSize` is ignored — pass one or the other."
      );
    } else if (onSizeChangeEnd === undefined) {
      didWarnControlledSizeRef.current = true;
      console.warn(
        "[Splitter] `size` is controlled but `onSizeChangeEnd` is not set. After a drag or keyboard resize the splitter keeps that value and behaves as uncontrolled. Wire `onSizeChangeEnd` and feed the value back to stay controlled."
      );
    }
  }, [isSizeControlled, defaultSize, onSizeChangeEnd]);

  const registerPane = useCallback((role: SplitterPaneRole, domId: string) => {
    setPaneOrder((order) => (order.includes(role) ? order : [...order, role]));
    setPaneDomIds((map) =>
      map[role] === domId ? map : { ...map, [role]: domId }
    );
  }, []);

  const unregisterPane = useCallback((role: SplitterPaneRole) => {
    setPaneOrder((order) => order.filter((r) => r !== role));
    setPaneDomIds((map) => {
      if (!(role in map)) return map;
      const next = { ...map };
      delete next[role];
      return next;
    });
  }, []);

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (isDisabled) return;
      if (next === collapsed) return;
      if (next && !asideConfig.collapsible) return;
      if (!isCollapseControlled) setInternalCollapsed(next);
      onCollapsedChange?.(next);
      // Size reconciliation happens in the collapse effect reacting to the
      // resolved collapsed change (covers controlled + uncontrolled).
    },
    [
      isDisabled,
      collapsed,
      asideConfig.collapsible,
      isCollapseControlled,
      onCollapsedChange,
    ]
  );

  const restoreDefaults = useCallback(() => {
    if (!bothRegistered(paneOrder)) return;
    const initial = initialSizeRef.current;
    if (collapsed) {
      // Only touch internal collapse bookkeeping when uncontrolled. In
      // controlled mode the prop is the source of truth — resetting the refs
      // here would desync them from a prop that hasn't changed yet; instead we
      // just fire the callback so the consumer can clear `collapsed`.
      if (!isCollapseControlled) {
        appliedCollapseRef.current = false;
        preCollapseSizeRef.current = null;
        setInternalCollapsed(false);
      }
      onCollapsedChange?.(false);
    }
    commitSize(initial);
  }, [
    paneOrder,
    collapsed,
    isCollapseControlled,
    onCollapsedChange,
    commitSize,
  ]);

  return useMemo<SplitterContextValue>(
    () => ({
      size,
      setSize,
      commitSize,
      orientation,
      keyboardStep,
      isDoubleClickDisabled,
      isDisabled,
      asideConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsed,
      setCollapsed,
      restoreDefaults,
    }),
    [
      size,
      setSize,
      commitSize,
      orientation,
      keyboardStep,
      isDoubleClickDisabled,
      isDisabled,
      asideConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsed,
      setCollapsed,
      restoreDefaults,
    ]
  );
};
