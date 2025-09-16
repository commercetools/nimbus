import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useNumberField, useLocale } from "react-aria";
import { useNumberFieldState } from "react-stately";
import { Box } from "@/components";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import {
  NumberInputRootSlot,
  NumberInputInputSlot,
  NumberInputIncrementButtonSlot,
  NumberInputDecrementButtonSlot,
} from "./number-input.slots";
import type { NumberInputProps } from "./number-input.types";
import { numberInputRecipe } from "./number-input.recipe";
import { useIntl } from "react-intl";
import messages from "./number-input.i18n";
/**
 * # NumberInput
 *
 * A number input allows users to enter numerical values and adjust them incrementally.
 * The locale for formatting comes from React Aria's I18nProvider context.
 */
export const NumberInput = (props: NumberInputProps) => {
  const { size, ref: forwardedRef, step, ...restProps } = props;
  const { locale } = useLocale();
  const intl = useIntl();
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Split recipe props first
  const recipe = useSlotRecipe({ recipe: numberInputRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps(restProps);

  // Extract style props
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  // Enhance functional props with localized aria-labels
  const enhancedFunctionalProps = {
    ...functionalProps,
    locale: locale,
    incrementAriaLabel: intl.formatMessage(messages.increment),
    decrementAriaLabel: intl.formatMessage(messages.decrement),
    // CRITICAL: React Aria Step Behavior
    //
    // React Aria NumberField uses the `step` property for TWO distinct purposes:
    // 1. Increment/Decrement Amount: How much to add/subtract when using buttons/arrow keys
    // 2. Validation Constraint: A validation rule that snaps typed values to step boundaries on blur
    //
    // KEY BEHAVIOR DIFFERENCE:
    // - WITH step (e.g., step: 1):
    //   • On blur: calls snapValueToStep(12.345, min, max, 1) → rounds to 12
    //   • High precision input (12.345) gets truncated to step boundary (12)
    //   • Step validation overrides formatOptions.maximumFractionDigits
    //
    // - WITHOUT step (undefined/null):
    //   • On blur: NO step validation occurs
    //   • High precision input (12.345) is preserved
    //   • Only formatOptions.maximumFractionDigits controls display precision
    //   • Increment/decrement still works with default behavior (integer steps)
    //
    // ACTUAL CODE (React Aria's internal commit function):
    // Source: react-spectrum/packages/@react-stately/numberfield/src/useNumberFieldState.ts
    // Related issue: https://github.com/adobe/react-spectrum/issues/6359
    // ```
    // let clampedValue: number;
    // if (step === undefined || isNaN(step)) {
    //   // NO STEP: Only enforce min/max bounds, preserve precision
    //   clampedValue = clamp(parsedValue, minValue, maxValue);
    // } else {
    //   // WITH STEP: Enforce min/max bounds AND snap to step boundaries (loses precision)
    //   clampedValue = snapValueToStep(parsedValue, minValue, maxValue, step);
    // }
    // ```
    //
    // CONCLUSION: For high precision currency inputs, step should be undefined
    // to prevent React Aria's step validation from truncating user input.
    //
    // Only use `step` if the consumer provides it to preserve high precision.
    step: step || undefined,
  };

  // Pass enhanced props to react-aria
  const state = useNumberFieldState(enhancedFunctionalProps);
  const { inputProps, incrementButtonProps, decrementButtonProps } =
    useNumberField(enhancedFunctionalProps, state, ref);

  const stateProps = {
    "data-invalid": props.isInvalid,
    "data-disabled": props.isDisabled,
  };

  return (
    <NumberInputRootSlot {...recipeProps} {...styleProps} size={size}>
      <NumberInputInputSlot
        ref={ref}
        {...inputProps}
        {...stateProps}
        size={size}
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        display="flex"
        flexDirection="column"
        height="full"
      >
        <NumberInputIncrementButtonSlot
          {...incrementButtonProps}
          {...stateProps}
        >
          <KeyboardArrowUp />
        </NumberInputIncrementButtonSlot>
        <NumberInputDecrementButtonSlot
          {...decrementButtonProps}
          {...stateProps}
        >
          <KeyboardArrowDown />
        </NumberInputDecrementButtonSlot>
      </Box>
    </NumberInputRootSlot>
  );
};

NumberInput.displayName = "NumberInput";
