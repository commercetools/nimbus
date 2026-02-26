import {
  useSlotRecipe,
  type SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { useBreakpointValue } from "@chakra-ui/react/hooks";
import { useChakraContext } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import type { StepsRootProps } from "../steps.types";
import { StepsRootSlot } from "../steps.slots";

/**
 * # Steps.Root
 *
 * Container component that manages step state and provides context to child components.
 * Wraps Chakra UI's Steps.Root component with Nimbus styling.
 *
 * @example
 * ```tsx
 * // Uncontrolled usage
 * <Steps.Root defaultStep={0} count={3}>
 *   <Steps.List>...</Steps.List>
 *   <Steps.Content index={0}>Step 1 content</Steps.Content>
 * </Steps.Root>
 *
 * // Controlled usage
 * <Steps.Root step={currentStep} onStepChange={handleStepChange} count={3}>
 *   ...
 * </Steps.Root>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsRoot = (props: StepsRootProps) => {
  const {
    ref: forwardedRef,
    count,
    defaultStep,
    step,
    onStepChange,
    onStepComplete,
    linear,
    size = "sm",
    orientation = "horizontal",
    children,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ key: "nimbusSteps" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    size,
    orientation,
    ...restProps,
  });

  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  // Normalize responsive values to compute current breakpoint values
  // This is needed for Chakra's Steps.Root which needs the resolved orientation
  const sysCtx = useChakraContext();
  const normalizedOrientation = sysCtx.normalizeValue(orientation);

  // useBreakpointValue returns undefined on initial render or when the value
  // is not responsive. In some edge cases (SSR/hydration), it may return the
  // object itself rather than undefined, so we also check it's a valid string.
  const breakpointOrientation = useBreakpointValue<"horizontal" | "vertical">(
    normalizedOrientation
  );
  const computedOrientation =
    typeof breakpointOrientation === "string"
      ? breakpointOrientation
      : typeof orientation === "string"
        ? orientation
        : "horizontal";

  // Remove responsive orientation from recipeProps and use computed value instead.
  // This prevents the responsive object (e.g., { base: "vertical", md: "horizontal" })
  // from being passed as [object Object] to internal components.
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orientation: _responsiveOrientation,
    ...recipePropsWithoutOrientation
  } = recipeProps as typeof recipeProps & {
    orientation?: SlotRecipeProps<"nimbusSteps">["orientation"];
  };

  return (
    <StepsRootSlot
      ref={forwardedRef}
      data-slot="root"
      {...recipePropsWithoutOrientation}
      // Pass computed orientation for recipe variant styling
      orientation={computedOrientation as "horizontal" | "vertical"}
      {...styleProps}
      asChild
    >
      <ChakraSteps.Root
        count={count}
        defaultStep={defaultStep}
        step={step}
        onStepChange={onStepChange}
        onStepComplete={onStepComplete}
        linear={linear}
        orientation={computedOrientation}
        unstyled
        {...functionalProps}
      >
        {children}
      </ChakraSteps.Root>
    </StepsRootSlot>
  );
};
StepsRoot.displayName = "Steps.Root";
