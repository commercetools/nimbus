import { useCallback, useMemo, useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useObjectRef,
  useSeparator,
} from "react-aria";
import { useLocalizedStringFormatter } from "@/hooks";
import { mergeRefs } from "@/utils";
import { SplitterHandleSlot } from "../splitter.slots";
import {
  useSplitterContext,
  useHandleResize,
  useHandleKeyboard,
  type HandlePanePair,
} from "../hooks";
import { computeAriaBounds } from "../utils";
import { splitterMessagesStrings } from "../splitter.messages";
import type { SplitterHandleProps } from "../splitter.types";

/**
 * Interactive separator between two `Splitter.Pane`s. Carries no per-handle
 * configuration — `keyboardStep`, `isDoubleClickDisabled`, `isDisabled`, and the
 * default `aria-label` are configured on `Splitter.Root`.
 *
 * This component is the thin assembler: it resolves the two adjacent panes from
 * DOM order, delegates resize and keyboard behaviour to focused hooks, and wires
 * up the ARIA separator attributes. The mechanics live alongside it:
 * - `useHandleResize` — pointer drag (px→%) + the clamped `applyDelta` writer.
 * - `useHandleKeyboard` — arrow / Home / End / Enter handling.
 * - `computeAriaBounds` — the collapse-aware `aria-valuemin` / `aria-valuemax`.
 *
 * ARIA model (W3C window splitter):
 * - `role="separator"` with `aria-orientation` mirroring `Splitter.Root`.
 * - `aria-valuenow` is the previous pane's size (rounded for AT only — the
 *   underlying size keeps full float precision).
 * - `aria-valuemin` / `aria-valuemax` are the lowest / highest position the
 *   boundary can occupy (see `computeAriaBounds`). They stay collapse-aware so
 *   `aria-valuenow` remains in range when a pane is collapsed below `minSize`.
 * - `aria-valuetext` announces the size as a percentage.
 * - `aria-controls` is the DOM id of the previous Pane sibling.
 *
 * Keyboard (see `useHandleKeyboard`):
 * - Arrow keys move the boundary by `Splitter.Root.keyboardStep` (orientation-aware).
 * - Home / End jump the boundary to the active min / max.
 * - Enter toggles collapse of the adjacent collapsible pane.
 *
 * Pointer (see `useHandleResize`):
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
    orientation,
    isDoubleClickDisabled,
    isDisabled,
    getPaneConfig,
    paneOrder,
    paneDomIds,
    collapsedPane,
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
  const panes: HandlePanePair = { prevId, nextId, hasPair, prevCfg, nextCfg };

  // While a pane is collapsed the boundary sits at `collapsedSize` (below
  // `minSize`), so any resize could only snap to `minSize`. Lock drag + keyboard
  // resizing while collapsed; reopen via Enter, double-click, or the controlled
  // prop. See the JSDoc above.
  const isResizeLocked = collapsedPane !== null;

  const { moveProps, applyDelta } = useHandleResize({
    handleRef,
    panes,
    isResizeLocked,
  });
  const { onKeyDown } = useHandleKeyboard({ hasPair, applyDelta });

  const { separatorProps } = useSeparator({
    orientation,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  });
  const { focusProps, isFocusVisible } = useFocusRing();

  const handleDoubleClick = useCallback(() => {
    if (isDisabled || isDoubleClickDisabled) return;
    restoreDefaults();
  }, [isDisabled, isDoubleClickDisabled, restoreDefaults]);

  const { min: ariaValueMin, max: ariaValueMax } = computeAriaBounds(
    prevCfg,
    nextCfg
  );

  const prevSize = prevId ? (sizes[prevId] ?? 0) : 0;
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
      onKeyDown,
      onDoubleClick: handleDoubleClick,
      style: { ...positionStyle, ...style },
    },
    props
  );

  return <SplitterHandleSlot ref={handleRef} {...combinedProps} />;
};

SplitterHandle.displayName = "Splitter.Handle";
