import { forwardRef, useRef, useCallback } from "react";
import {
  useSeparator,
  useMove,
  useFocusRing,
  useObjectRef,
  mergeProps,
} from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { WindowSplitterSeparatorSlot } from "../window-splitter.slots";
import { useWindowSplitterContext } from "./../window-splitter";
import type { WindowSplitterSeparatorProps } from "../window-splitter.types";

export const WindowSplitterSeparator = forwardRef<
  HTMLDivElement,
  WindowSplitterSeparatorProps
>(
  (
    {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      style,
      ...props
    },
    ref
  ) => {
    const context = useWindowSplitterContext();
    const {
      value,
      setValue,
      orientation,
      isDisabled,
      minValue,
      maxValue,
      step,
      primaryPaneId,
    } = context;

    const localRef = useRef<HTMLDivElement>(null);
    const separatorRef = useObjectRef(mergeRefs(localRef, ref));

    // Handle keyboard and mouse movement
    const handleMove = useCallback(
      (deltaX: number, deltaY: number) => {
        if (isDisabled) return;

        const delta = orientation === "horizontal" ? deltaX : deltaY;
        const containerSize =
          orientation === "horizontal"
            ? separatorRef.current?.parentElement?.offsetWidth || 1
            : separatorRef.current?.parentElement?.offsetHeight || 1;

        // Convert pixel delta to percentage
        const percentageDelta = (delta / containerSize) * 100;
        const newValue = value + percentageDelta;

        setValue(newValue);
      },
      [value, setValue, orientation, isDisabled, separatorRef]
    );

    // Use react-aria's useSeparator for ARIA semantics
    const { separatorProps } = useSeparator({
      orientation,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    });

    // Use react-aria's useMove for drag interactions
    const { moveProps } = useMove({
      onMove(e) {
        handleMove(e.deltaX, e.deltaY);
      },
    });

    // Use react-aria's useFocusRing for focus management
    const { focusProps, isFocusVisible } = useFocusRing();

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (isDisabled) return;

        let delta = 0;
        const stepSize = step;

        switch (event.key) {
          case "ArrowLeft":
            if (orientation === "horizontal") {
              delta = -stepSize;
              event.preventDefault();
            }
            break;
          case "ArrowRight":
            if (orientation === "horizontal") {
              delta = stepSize;
              event.preventDefault();
            }
            break;
          case "ArrowUp":
            if (orientation === "vertical") {
              delta = -stepSize;
              event.preventDefault();
            }
            break;
          case "ArrowDown":
            if (orientation === "vertical") {
              delta = stepSize;
              event.preventDefault();
            }
            break;
          case "Home":
            setValue(minValue);
            event.preventDefault();
            break;
          case "End":
            setValue(maxValue);
            event.preventDefault();
            break;
          case "Enter":
            // Toggle between collapsed and previous position
            if (value === minValue) {
              setValue(50); // Default restore position
            } else {
              setValue(minValue);
            }
            event.preventDefault();
            break;
        }

        if (delta !== 0) {
          setValue(value + delta);
        }
      },
      [value, setValue, orientation, isDisabled, step, minValue, maxValue]
    );

    // Calculate position based on the splitter value
    const positionStyle =
      orientation === "horizontal"
        ? { left: `${value}%` }
        : { top: `${value}%` };

    const combinedProps = mergeProps(
      separatorProps,
      moveProps,
      focusProps,
      {
        role: "separator",
        tabIndex: isDisabled ? -1 : 0,
        "aria-valuenow": value,
        "aria-valuemin": minValue,
        "aria-valuemax": maxValue,
        "aria-orientation": orientation,
        "aria-controls": primaryPaneId,
        "data-focus-visible": isFocusVisible || undefined,
        onKeyDown: handleKeyDown,
        style: {
          ...positionStyle,
          ...style,
        },
      },
      props
    );

    return (
      <WindowSplitterSeparatorSlot ref={separatorRef} {...combinedProps} />
    );
  }
);

WindowSplitterSeparator.displayName = "WindowSplitter.Separator";
