import { useCallback, useRef } from "react";
import type { RefObject } from "react";
import { useMove } from "react-aria";
import { useSplitterContext } from "./use-splitter-context";
import { clampedResize } from "../utils";
import type { SplitterPaneConfig } from "../splitter.types";

/** The two panes a handle sits between, resolved from sibling DOM order. */
export type HandlePanePair = {
  prevId?: string;
  nextId?: string;
  /** True once both ids are present. */
  hasPair: boolean;
  prevCfg: SplitterPaneConfig;
  nextCfg: SplitterPaneConfig;
};

// Drag deltas (in percentage points) below this are accumulated rather than
// dropped, so slow / sub-pixel movement still registers once it adds up.
const MOVE_TOLERANCE = 0.0001;

type UseHandleResizeOptions = {
  /** Ref to the handle, used to measure the container for px→% conversion. */
  handleRef: RefObject<HTMLDivElement | null>;
  panes: HandlePanePair;
  /** Locked while a pane is collapsed (resize would only snap to `minSize`). */
  isResizeLocked: boolean;
};

/**
 * Owns the handle's resize mechanics: `applyDelta` (a clamped size writer,
 * returned so the keyboard hook reuses it) and `moveProps` (pointer drag via
 * react-aria `useMove`, converting px deltas to container percentages).
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
