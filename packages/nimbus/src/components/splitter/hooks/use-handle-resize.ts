import { useCallback, useRef } from "react";
import type { RefObject } from "react";
import { useMove } from "react-aria";
import { useSplitterContext } from "./use-splitter-context";
import { clampedResize } from "../utils";
import type { SplitterPaneConfig } from "../splitter.types";

/** The two panes a handle sits between, resolved from sibling DOM order. */
export type HandlePanePair = {
  /** Previous (left/top) pane id, if registered. */
  prevId?: string;
  /** Next (right/bottom) pane id, if registered. */
  nextId?: string;
  /** True once both `prevId` and `nextId` are present. */
  hasPair: boolean;
  /** Config of the previous pane (empty object until registered). */
  prevCfg: SplitterPaneConfig;
  /** Config of the next pane (empty object until registered). */
  nextCfg: SplitterPaneConfig;
};

// Drag deltas (in percentage points) below this are accumulated rather than
// dropped, so slow / sub-pixel movement still registers once it adds up.
const MOVE_TOLERANCE = 0.0001;

type UseHandleResizeOptions = {
  /** Ref to the handle element, used to measure the container for px→% conversion. */
  handleRef: RefObject<HTMLDivElement | null>;
  /** The two panes this handle controls. */
  panes: HandlePanePair;
  /**
   * Resizing is locked while a pane is collapsed: the boundary sits below
   * `minSize`, so any move could only snap back to `minSize`. See the
   * `SplitterHandle` JSDoc.
   */
  isResizeLocked: boolean;
};

/**
 * Owns the handle's resize mechanics:
 *
 * - `applyDelta(delta, commit)` clamps a percentage-point delta against both
 *   panes' `minSize` (via `clampedResize`) and writes it live (`setSizes`) or
 *   settled (`commitSizes`). Returned so the keyboard hook reuses the same
 *   clamped writer. No-op while disabled, unpaired, or collapse-locked.
 * - `moveProps` (react-aria `useMove`) handles pointer drag: it converts pixel
 *   deltas to a percentage of the container, accumulates movement below
 *   `MOVE_TOLERANCE` so slow drags aren't lost, and settles on drag end.
 */
export const useHandleResize = ({
  handleRef,
  panes,
  isResizeLocked,
}: UseHandleResizeOptions) => {
  const { sizes, setSizes, commitSizes, orientation, isDisabled } =
    useSplitterContext();
  const { prevId, nextId, hasPair, prevCfg, nextCfg } = panes;

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

  // Accumulate per-event deltas across a single drag so movements smaller than
  // MOVE_TOLERANCE aren't dropped — they build up until they clear the gate.
  const dragAccumRef = useRef(0);

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

  return { moveProps, applyDelta };
};
