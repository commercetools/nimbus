import { forwardRef, useState, useCallback, useMemo } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { WindowSplitterRootSlot } from "../window-splitter.slots";
import { WindowSplitterContext } from "./window-splitter.context";
import { windowSplitterSlotRecipe } from "../window-splitter.recipe";
import type { WindowSplitterRootProps } from "../window-splitter.types";

export const WindowSplitterRoot = forwardRef<
  HTMLDivElement,
  WindowSplitterRootProps
>(
  (
    {
      children,
      orientation = "horizontal",
      value: controlledValue,
      defaultValue = 50,
      onValueChange,
      minValue = 0,
      maxValue = 100,
      isDisabled = false,
      step = 5,
      ...props
    },
    ref
  ) => {
    const recipe = useSlotRecipe({ recipe: windowSplitterSlotRecipe });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps({
      orientation,
      ...props,
    });
    const [styleProps, restProps] = extractStyleProps(restRecipeProps);

    // State management for controlled/uncontrolled behavior
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Primary pane ID for aria-controls
    const [primaryPaneId, setPrimaryPaneId] = useState<string>();

    const setValue = useCallback(
      (newValue: number) => {
        // Clamp the value between min and max
        const clampedValue = Math.min(Math.max(newValue, minValue), maxValue);

        if (!isControlled) {
          setInternalValue(clampedValue);
        }

        onValueChange?.(clampedValue);
      },
      [isControlled, minValue, maxValue, onValueChange]
    );

    const contextValue = useMemo(
      () => ({
        value,
        setValue,
        orientation,
        isDisabled,
        minValue,
        maxValue,
        step,
        primaryPaneId,
        setPrimaryPaneId,
      }),
      [
        value,
        setValue,
        orientation,
        isDisabled,
        minValue,
        maxValue,
        step,
        primaryPaneId,
      ]
    );

    return (
      <WindowSplitterContext.Provider value={contextValue}>
        <WindowSplitterRootSlot
          ref={ref}
          {...recipeProps}
          {...styleProps}
          {...restProps}
        >
          {children}
        </WindowSplitterRootSlot>
      </WindowSplitterContext.Provider>
    );
  }
);

WindowSplitterRoot.displayName = "WindowSplitter.Root";
