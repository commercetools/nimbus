import { useCallback, useMemo, useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useMove,
  useObjectRef,
  useSeparator,
} from "react-aria";
import { useLocalizedStringFormatter } from "@/hooks";
import { mergeRefs } from "@/utils";
import { SplitterHandleSlot } from "../splitter.slots";
import { useSplitterContext } from "../hooks/use-splitter-context";
import { clampedResize, pickCollapseTarget } from "../utils";
import { splitterMessagesStrings } from "../splitter.messages";
import type { SplitterHandleProps } from "../splitter.types";

const MOVE_TOLERANCE = 0.0001;

/**
 * Interactive separator between two `Splitter.Pane`s. Carries no per-handle
 * configuration — `keyboardStep`, `isDoubleClickDisabled`, `isDisabled`, and the
 * default `aria-label` are configured on `Splitter.Root`.
 *
 * ARIA model (W3C window splitter):
 * - `role="separator"` with `aria-orientation` mirroring `Splitter.Root`.
 * - `aria-valuenow` is the previous pane's size (rounded for AT only — the
 *   underlying size keeps full float precision).
 * - `aria-valuemin` / `aria-valuemax` are the lowest / highest position the
 *   boundary can occupy, derived from per-pane constraints. The floor is a
 *   pane's `minSize`, except for a collapsible pane whose `collapsedSize` is the
 *   true minimum it can reach (the discrete collapse state, below `minSize`):
 *     `min = collapseFloor(panes.prev)`
 *     `max = 100 − collapseFloor(panes.next)`
 *   where `collapseFloor(p) = p.collapsible ? min(p.minSize, p.collapsedSize) : p.minSize`.
 *   Keeping the bounds collapse-aware means `aria-valuenow` stays truthful (it
 *   reports the real collapsed size) without falling outside the range.
 * - `aria-valuetext` announces the size as a percentage.
 * - `aria-controls` is the DOM id of the previous Pane sibling.
 *
 * Keyboard:
 * - Arrow keys move the boundary by `Splitter.Root.keyboardStep` (orientation-aware).
 * - Home / End jump the boundary to the active min / max.
 * - Enter toggles collapse of the adjacent collapsible pane (drives the
 *   uncontrolled collapse state, or fires `onCollapsedPaneChange` when controlled).
 *
 * Pointer:
 * - Drag via `useMove` from react-aria (live `onSizesChange`; settled
 *   `onSizesChangeEnd` on drag end).
 * - Double-click restores the boundary to the initial sizes resolved on mount
 *   (gated by `Splitter.Root.isDoubleClickDisabled`). Decoupled from collapse.
 *
 * Resize lock while collapsed:
 * - When a pane is collapsed the boundary sits at `collapsedSize`, below the
 *   pane's `minSize` — inside the intentionally-invalid `[collapsedSize,
 *   minSize)` range. Any drag or arrow/Home/End keypress could only snap
 *   straight to `minSize`, so resizing is disabled while collapsed. The pane is
 *   reopened via Enter (toggle), double-click (restore), or the controlled
 *   `collapsedPane` prop — never by dragging.
 *
 * @supportsStyleProps
 */
export const SplitterHandle = ({
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledBy,
  style,
  ref: forwardedRef,
  ...props
}: SplitterHandleProps) => {
  const {
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
    collapsedPane,
    setCollapsedPane,
    restoreDefaults,
  } = useSplitterContext();

  const msg = useLocalizedStringFormatter(splitterMessagesStrings);
  const ariaLabel = ariaLabelProp ?? msg.format("resizePanes");

  const localRef = useRef<HTMLDivElement>(null);
  const handleRef = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Resolve the two panes this handle controls from sibling DOM order. The
  // root tracks `paneOrder` as panes register; for a well-formed splitter the
  // first entry is the "previous" pane (left/top) and the second is the "next".
  const prevId = paneOrder[0];
  const nextId = paneOrder[1];
  const hasPair = !!prevId && !!nextId;

  const prevCfg = useMemo(
    () => (prevId ? getPaneConfig(prevId) : {}),
    [prevId, getPaneConfig]
  );
  const nextCfg = useMemo(
    () => (nextId ? getPaneConfig(nextId) : {}),
    [nextId, getPaneConfig]
  );

  // ARIA bounds = the lowest/highest position the boundary can occupy. The
  // floor is a pane's `minSize`, except a collapsible pane can reach its
  // `collapsedSize` (the discrete collapse state, below `minSize`) — so the
  // announced bounds must include it to keep `aria-valuenow` in range when
  // collapsed. No separate maxSize: the upper bound is the partner's complement.
  const prevSize = prevId ? (sizes[prevId] ?? 0) : 0;
  const collapseFloor = (cfg: typeof prevCfg) =>
    cfg.collapsible
      ? Math.min(cfg.minSize ?? 0, cfg.collapsedSize ?? 0)
      : (cfg.minSize ?? 0);
  const ariaValueMin = collapseFloor(prevCfg);
  const ariaValueMax = 100 - collapseFloor(nextCfg);

  // While a pane is collapsed the boundary sits at `collapsedSize` (below
  // `minSize`), so any resize could only snap to `minSize`. Lock drag + keyboard
  // resizing while collapsed; reopen via Enter, double-click, or the controlled
  // prop. See the ARIA-model JSDoc above.
  const isResizeLocked = collapsedPane !== null;

  // Accumulate per-event deltas across a single drag so movements smaller than
  // MOVE_TOLERANCE aren't dropped — they build up until they clear the gate.
  const dragAccumRef = useRef(0);

  const applyDelta = useCallback(
    (delta: number, commit: boolean) => {
      if (!hasPair || isDisabled || isResizeLocked) return;
      const next = clampedResize({
        sizes,
        handlePanes: { prev: prevId!, next: nextId! },
        delta,
        paneConfigs: {
          [prevId!]: prevCfg,
          [nextId!]: nextCfg,
        },
      });
      if (commit) {
        commitSizes(next);
      } else {
        setSizes(next);
      }
    },
    [
      hasPair,
      isDisabled,
      isResizeLocked,
      sizes,
      prevId,
      nextId,
      prevCfg,
      nextCfg,
      setSizes,
      commitSizes,
    ]
  );

  const { separatorProps } = useSeparator({
    orientation,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  });

  const { moveProps } = useMove({
    onMoveStart() {
      dragAccumRef.current = 0;
    },
    onMove(e) {
      if (!hasPair || isDisabled || isResizeLocked) return;
      const parent = handleRef.current?.parentElement;
      if (!parent) return;
      const containerSize =
        orientation === "horizontal" ? parent.offsetWidth : parent.offsetHeight;
      if (containerSize <= 0) return;
      const deltaPx = orientation === "horizontal" ? e.deltaX : e.deltaY;
      dragAccumRef.current += (deltaPx / containerSize) * 100;
      const wholeDelta = dragAccumRef.current;
      if (Math.abs(wholeDelta) < MOVE_TOLERANCE) return;
      dragAccumRef.current = 0;
      applyDelta(wholeDelta, false);
    },
    onMoveEnd() {
      if (!hasPair || isDisabled || isResizeLocked) return;
      // Settle: fire onSizesChangeEnd with the current sizes (the persistence seam).
      commitSizes();
    },
  });

  const { focusProps, isFocusVisible } = useFocusRing();

  const toggleCollapse = useCallback(() => {
    if (!hasPair || isDisabled) return;
    // If anything is collapsed, Enter expands it; otherwise collapse the pick.
    if (collapsedPane !== null) {
      setCollapsedPane(null);
      return;
    }
    const target = pickCollapseTarget(paneOrder, sizes, getPaneConfig);
    if (target) setCollapsedPane(target.paneId);
  }, [
    hasPair,
    isDisabled,
    collapsedPane,
    paneOrder,
    sizes,
    getPaneConfig,
    setCollapsedPane,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!hasPair || isDisabled) return;
      switch (event.key) {
        case "ArrowLeft":
          if (orientation === "horizontal") {
            event.preventDefault();
            applyDelta(-keyboardStep, true);
          }
          return;
        case "ArrowRight":
          if (orientation === "horizontal") {
            event.preventDefault();
            applyDelta(keyboardStep, true);
          }
          return;
        case "ArrowUp":
          if (orientation === "vertical") {
            event.preventDefault();
            applyDelta(-keyboardStep, true);
          }
          return;
        case "ArrowDown":
          if (orientation === "vertical") {
            event.preventDefault();
            applyDelta(keyboardStep, true);
          }
          return;
        case "Home":
          event.preventDefault();
          applyDelta(-100, true);
          return;
        case "End":
          event.preventDefault();
          applyDelta(100, true);
          return;
        case "Enter":
          event.preventDefault();
          toggleCollapse();
          return;
      }
    },
    [hasPair, isDisabled, orientation, keyboardStep, applyDelta, toggleCollapse]
  );

  const handleDoubleClick = useCallback(() => {
    if (isDisabled || isDoubleClickDisabled) return;
    restoreDefaults();
  }, [isDisabled, isDoubleClickDisabled, restoreDefaults]);

  const ariaControls = prevId ? paneDomIds[prevId] : undefined;
  const roundedValueNow = prevId ? Math.round(prevSize) : undefined;

  // Position the absolute-positioned handle on the boundary between the two
  // panes. The recipe's `transform: translate(±50%)` centers the visible
  // track on this offset so the interactive area straddles both panes.
  const positionStyle =
    orientation === "horizontal"
      ? { left: `${prevSize}%` }
      : { top: `${prevSize}%` };

  const combinedProps = mergeProps(
    separatorProps,
    moveProps,
    focusProps,
    {
      // `role="separator"` comes from `separatorProps` (useSeparator) above.
      tabIndex: isDisabled ? -1 : 0,
      "aria-valuenow": roundedValueNow,
      "aria-valuemin": ariaValueMin,
      "aria-valuemax": ariaValueMax,
      "aria-valuetext":
        roundedValueNow !== undefined ? `${roundedValueNow}%` : undefined,
      "aria-orientation": orientation,
      "aria-controls": ariaControls,
      "aria-disabled": isDisabled || undefined,
      "data-focus-visible": isFocusVisible || undefined,
      "data-disabled": isDisabled || undefined,
      "data-resize-locked": isResizeLocked || undefined,
      onKeyDown: handleKeyDown,
      onDoubleClick: handleDoubleClick,
      style: { ...positionStyle, ...style },
    },
    props
  );

  return <SplitterHandleSlot ref={handleRef} {...combinedProps} />;
};

SplitterHandle.displayName = "Splitter.Handle";
