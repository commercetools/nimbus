import { useCallback, useRef } from "react";
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
} from "../hooks";
import { computeAriaBounds } from "../utils";
import { splitterMessagesStrings } from "../splitter.messages";
import type { SplitterHandleProps } from "../splitter.types";

/**
 * Interactive `role="separator"` between `Splitter.Aside` and `Splitter.Main`,
 * exposing the W3C window-splitter ARIA value attributes. Takes no per-handle
 * config (that lives on `Splitter.Root`); delegates drag, keyboard, and ARIA
 * bounds to focused hooks/utils. The aria value tracks the *leading* pane, so it
 * works whichever side the aside is on.
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
    size,
    orientation,
    isDoubleClickDisabled,
    isDisabled,
    asideConfig,
    paneOrder,
    paneDomIds,
    collapsed,
    restoreDefaults,
  } = useSplitterContext();

  const msg = useLocalizedStringFormatter(splitterMessagesStrings);
  const ariaLabel = ariaLabelProp ?? msg.format("resizePanes");

  const localRef = useRef<HTMLDivElement>(null);
  const handleRef = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Resolve the two panes this handle controls from registration (DOM) order.
  // The first registered role is the "leading" (left/top) pane; the aside can be
  // on either side, so the single `size` maps to the leading pane accordingly.
  const prevRole = paneOrder[0];
  const nextRole = paneOrder[1];
  const isReady = !!prevRole && !!nextRole && prevRole !== nextRole;
  const asideLeads = prevRole === "aside";

  // A collapsed aside sits below its `minSize`, so any resize could only snap
  // back to `minSize` — lock resizing while collapsed (reopen via Enter,
  // double-click, or the controlled prop).
  const isResizeLocked = collapsed;

  const { moveProps, applyDelta } = useHandleResize({
    handleRef,
    asideLeads,
    isReady,
    isResizeLocked,
  });
  const { onKeyDown } = useHandleKeyboard({ isReady, applyDelta });

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
    asideConfig,
    asideLeads
  );

  // The boundary position = the leading pane's size. With the aside leading
  // that is `size`; with the main pane leading it is the remainder.
  const prevSize = isReady ? (asideLeads ? size : 100 - size) : 0;
  const ariaControls = isReady ? paneDomIds[prevRole] : undefined;
  const roundedValueNow = isReady ? Math.round(prevSize) : undefined;

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
