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
 * Interactive `role="separator"` between two `Splitter.Pane`s, exposing the W3C
 * window-splitter ARIA value attributes. Takes no per-handle config — that lives
 * on `Splitter.Root`.
 *
 * Thin assembler: resolves the adjacent pane pair, then delegates behaviour to
 * `useHandleResize` (pointer drag), `useHandleKeyboard` (arrow/Home/End/Enter),
 * and `computeAriaBounds` (collapse-aware min/max).
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

  // A collapsed pane sits below its `minSize`, so any resize could only snap
  // back to `minSize` — lock resizing while collapsed (reopen via Enter,
  // double-click, or the controlled prop).
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
