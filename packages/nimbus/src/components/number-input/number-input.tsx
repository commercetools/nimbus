import { useRef } from "react";
import { mergeRefs, useSlotRecipe } from "@chakra-ui/react";
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
/**
 * NumberInput
 * ============================================================
 * An input component that accepts only numbers with increment/decrement buttons
 *
 * Features:
 *
 * - supports ref forwarding to the underlying DOM element
 * - supports number-specific props like min, max, step
 * - includes increment/decrement buttons for easy number adjustment
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - provides full accessibility support
 */
export const NumberInput = (props: NumberInputProps) => {
  const { size, ref: forwardedRef, ...restProps } = props;
  const { locale } = useLocale();

  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Split recipe props first
  const recipe = useSlotRecipe({ recipe: numberInputRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps(restProps);

  // Extract style props
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  // Pass only functional props to react-aria
  const state = useNumberFieldState({ locale, ...functionalProps });
  const { inputProps, incrementButtonProps, decrementButtonProps } =
    useNumberField(functionalProps, state, ref);

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
          aria-label="Increment"
          {...incrementButtonProps}
          {...stateProps}
        >
          <KeyboardArrowUp />
        </NumberInputIncrementButtonSlot>
        <NumberInputDecrementButtonSlot
          aria-label="Decrement"
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
