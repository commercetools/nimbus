import { forwardRef, useState, useCallback, useMemo } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { SplitterRootSlot } from "../splitter.slots";
import { SplitterContext } from "./splitter.context";
import type { SplitterRootProps } from "../splitter.types";

export const SplitterRoot = forwardRef<HTMLDivElement, SplitterRootProps>(
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
    const recipe = useSlotRecipe({ key: "nimbusSplitter" });
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
      <SplitterContext.Provider value={contextValue}>
        <SplitterRootSlot
          ref={ref}
          {...recipeProps}
          {...styleProps}
          {...restProps}
        >
          {children}
        </SplitterRootSlot>
      </SplitterContext.Provider>
    );
  }
);

SplitterRoot.displayName = "Splitter.Root";
