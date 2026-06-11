import { useCallback, useRef } from "react";
import type { HTMLAttributes, RefObject } from "react";
import { useMove } from "react-aria";
import { useSplitterContext } from "./use-splitter-context";
import { clampedResize } from "../utils";

// Drag deltas (in percentage points) below this are accumulated rather than
// dropped, so slow / sub-pixel movement still registers once it adds up.
const MOVE_TOLERANCE = 0.0001;

type UseHandleResizeOptions = {
  /** Ref to the handle, used to measure the container for px→% conversion. */
  handleRef: RefObject<HTMLDivElement | null>;
  /** True when the aside is the leading (prev) sibling — flips the Δ sign. */
  asideLeads: boolean;
  /** True once both panes are registered. */
  isReady: boolean;
  /** Locked while the aside is collapsed (resize would only snap to `minSize`). */
  isResizeLocked: boolean;
};

/**
 * Owns the handle's resize mechanics: `applyDelta` (a clamped size writer,
 * returned so the keyboard hook reuses it) and `moveProps` (pointer drag via
 * react-aria `useMove`, converting px deltas to container percentages).
 *
 * The handle's gesture grows the *leading* pane by Δ. This is translated into an
 * aside Δ before clamping: aside leading → `+Δ`, aside trailing → `−Δ`. The
 * single aside size is then clamped into `[minSize, maxSize]`.
 */
export const useHandleResize = ({
  handleRef,
  asideLeads,
  isReady,
  isResizeLocked,
}: UseHandleResizeOptions) => {
  const { size, setSize, commitSize, orientation, isDisabled, asideConfig } =
    useSplitterContext();

  const applyDelta = useCallback(
    (delta: number, commit: boolean) => {
      if (!isReady || isDisabled || isResizeLocked) return;
      const asideDelta = asideLeads ? delta : -delta;
      const next = clampedResize({
        size,
        delta: asideDelta,
        minSize: asideConfig.minSize,
        maxSize: asideConfig.maxSize,
      });
      if (commit) {
        commitSize(next);
      } else {
        setSize(next);
      }
    },
    [
      isReady,
      isDisabled,
      isResizeLocked,
      asideLeads,
      size,
      asideConfig.minSize,
      asideConfig.maxSize,
      setSize,
      commitSize,
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
      if (!isReady || isDisabled || isResizeLocked) return;
      const parent = handleRef.current?.parentElement;
      if (!parent) return;
      const containerSize =
        orientation === "horizontal" ? parent.offsetWidth : parent.offsetHeight;
      if (containerSize <= 0) return;
      const deltaPx = orientation === "horizontal" ? e.deltaX : e.deltaY;
      dragAccumRef.current += (deltaPx / containerSize) * 100;
      const wholeDelta = dragAccumRef.current;
      if (Math.abs(wholeDelta) < MOVE_TOLERANCE) return;
      dragAccumRef.current -= wholeDelta;
      applyDelta(wholeDelta, false);
    },
    onMoveEnd() {
      if (!isReady || isDisabled || isResizeLocked) return;
      // Settle: fire onSizeChangeEnd with the current size (the persistence seam).
      commitSize();
    },
  });

  return { moveProps, applyDelta } as {
    moveProps: HTMLAttributes<HTMLElement>;
    applyDelta: (delta: number, commit: boolean) => void;
  };
};
