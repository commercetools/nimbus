import { useSlotRecipe } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils";
import type { StepsRootProps, StepsContextValue } from "../steps.types";
import { StepsRootSlot } from "../steps.slots";
import { StepsContext } from "./steps.context";

/**
 * # Steps.Root
 *
 * Container component that manages step state and provides context to child components.
 *
 * @example
 * ```tsx
 * <Steps.Root step={1} count={3} size="sm" orientation="horizontal">
 *   <Steps.List>
 *     {/* Step items *\/}
 *   </Steps.List>
 * </Steps.Root>
 * ```
 */
export const StepsRoot = (props: StepsRootProps) => {
  const {
    ref: forwardedRef,
    step,
    count,
    size = "sm",
    orientation = "horizontal",
    children,
    ...restProps
  } = props;

  // Development-only validation
  if (process.env.NODE_ENV === "development") {
    if (step < 0 || step > count) {
      console.warn(
        `[Steps] step prop (${step}) is out of bounds. ` +
          `Expected value between 0 and ${count}.`
      );
    }
    if (count < 1) {
      console.warn(`[Steps] count prop (${count}) must be at least 1.`);
    }
  }

  const recipe = useSlotRecipe({ key: "nimbusSteps" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    size,
    orientation,
    ...restProps,
  });

  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  const contextValue: StepsContextValue = {
    step,
    count,
    size,
    orientation,
  };

  return (
    <StepsContext.Provider value={contextValue}>
      <StepsRootSlot
        ref={forwardedRef}
        data-slot="root"
        {...recipeProps}
        {...styleProps}
        {...functionalProps}
      >
        {children}
      </StepsRootSlot>
    </StepsContext.Provider>
  );
};
StepsRoot.displayName = "Steps.Root";
