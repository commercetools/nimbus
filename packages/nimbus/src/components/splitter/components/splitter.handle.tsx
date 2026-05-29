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

const COLLAPSE_TOLERANCE = 0.001;

/**
 * Interactive separator between two `Splitter.Pane`s. Carries no per-handle
 * configuration — `keyboardStep`, `disableDoubleClick`, and the default
 * `aria-label` are configured on `Splitter.Root`.
 *
 * ARIA model (W3C window splitter):
 * - `role="separator"` with `aria-orientation` mirroring `Splitter.Root`.
 * - `aria-valuenow` is the previous pane's size.
 * - `aria-valuemin` / `aria-valuemax` are derived from per-pane constraints:
 *     `min = panes.prev.minSize`
 *     `max = 100 − panes.next.minSize` (capped by `panes.prev.maxSize`).
 * - `aria-controls` is the DOM id of the previous Pane sibling.
 *
 * Keyboard:
 * - Arrow keys move the boundary by `Splitter.Root.keyboardStep` (orientation-aware).
 * - Home / End jump the boundary to the active min / max.
 * - Enter toggles collapse of the adjacent collapsible pane (if any).
 *
 * Pointer:
 * - Drag via `useMove` from react-aria.
 * - Double-click restores the boundary to the initial sizes resolved on mount
 *   (gated by `Splitter.Root.disableDoubleClick`). Decoupled from collapse so
 *   the gesture is meaningful on every splitter.
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
    orientation,
    keyboardStep,
    disableDoubleClick,
    getPaneConfig,
    paneOrder,
    paneDomIds,
    collapsePane,
    expandPane,
    isCollapsed,
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
  const bothDisabled = !!prevCfg.disabled && !!nextCfg.disabled;

  // ARIA bounds derived from per-pane constraints (not Root-level globals).
  const prevSize = prevId ? (sizes[prevId] ?? 0) : 0;
  const ariaValueMin = prevCfg.minSize ?? 0;
  const ariaValueMaxRaw = 100 - (nextCfg.minSize ?? 0);
  const ariaValueMax = Math.min(ariaValueMaxRaw, prevCfg.maxSize ?? 100);

  // Track cumulative pixel deltas across a single drag so sub-pixel
  // contributions don't round to zero on every event.
  const dragAccumRef = useRef(0);

  const applyDelta = useCallback(
    (delta: number, options?: { commitCollapse?: boolean }) => {
      if (!hasPair || bothDisabled) return;
      const next = clampedResize({
        sizes,
        handlePanes: { prev: prevId!, next: nextId! },
        delta,
        paneConfigs: {
          [prevId!]: prevCfg,
          [nextId!]: nextCfg,
        },
        options,
      });
      setSizes(next);
    },
    [hasPair, bothDisabled, sizes, prevId, nextId, prevCfg, nextCfg, setSizes]
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
      if (!hasPair || bothDisabled) return;
      const parent = handleRef.current?.parentElement;
      if (!parent) return;
      const containerSize =
        orientation === "horizontal" ? parent.offsetWidth : parent.offsetHeight;
      if (containerSize <= 0) return;
      const deltaPx = orientation === "horizontal" ? e.deltaX : e.deltaY;
      dragAccumRef.current += (deltaPx / containerSize) * 100;
      const wholeDelta = dragAccumRef.current;
      if (Math.abs(wholeDelta) < COLLAPSE_TOLERANCE) return;
      dragAccumRef.current = 0;
      applyDelta(wholeDelta);
    },
  });

  const { focusProps, isFocusVisible } = useFocusRing();

  const toggleCollapse = useCallback(() => {
    if (!hasPair) return;
    const target = pickCollapseTarget(paneOrder, sizes, getPaneConfig);
    if (!target) return;
    if (isCollapsed(target.paneId)) {
      expandPane(target.paneId);
    } else {
      collapsePane(target.paneId);
    }
  }, [
    hasPair,
    paneOrder,
    sizes,
    getPaneConfig,
    isCollapsed,
    collapsePane,
    expandPane,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!hasPair || bothDisabled) return;
      switch (event.key) {
        case "ArrowLeft":
          if (orientation === "horizontal") {
            event.preventDefault();
            applyDelta(-keyboardStep);
          }
          return;
        case "ArrowRight":
          if (orientation === "horizontal") {
            event.preventDefault();
            applyDelta(keyboardStep);
          }
          return;
        case "ArrowUp":
          if (orientation === "vertical") {
            event.preventDefault();
            applyDelta(-keyboardStep);
          }
          return;
        case "ArrowDown":
          if (orientation === "vertical") {
            event.preventDefault();
            applyDelta(keyboardStep);
          }
          return;
        case "Home":
          event.preventDefault();
          applyDelta(-100);
          return;
        case "End":
          event.preventDefault();
          applyDelta(100);
          return;
        case "Enter":
          event.preventDefault();
          toggleCollapse();
          return;
      }
    },
    [
      hasPair,
      bothDisabled,
      orientation,
      keyboardStep,
      applyDelta,
      toggleCollapse,
    ]
  );

  const handleDoubleClick = useCallback(() => {
    if (disableDoubleClick) return;
    restoreDefaults();
  }, [disableDoubleClick, restoreDefaults]);

  const ariaControls = prevId ? paneDomIds[prevId] : undefined;

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
      role: "separator",
      tabIndex: bothDisabled ? -1 : 0,
      "aria-valuenow": prevId ? Math.round(prevSize) : undefined,
      "aria-valuemin": ariaValueMin,
      "aria-valuemax": ariaValueMax,
      "aria-orientation": orientation,
      "aria-controls": ariaControls,
      "aria-disabled": bothDisabled || undefined,
      "data-focus-visible": isFocusVisible || undefined,
      "data-disabled": bothDisabled || undefined,
      onKeyDown: handleKeyDown,
      onDoubleClick: handleDoubleClick,
      style: { ...positionStyle, ...style },
    },
    props
  );

  return <SplitterHandleSlot ref={handleRef} {...combinedProps} />;
};

SplitterHandle.displayName = "Splitter.Handle";
