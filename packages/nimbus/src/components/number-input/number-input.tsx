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
  NumberInputLeadingElementSlot,
  NumberInputTrailingElementSlot,
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
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/number-input}
 */
export const NumberInput = (props: NumberInputProps) => {
  const {
    size,
    leadingElement,
    trailingElement,
    ref: forwardedRef,
    ...restProps
  } = props;
  const { locale } = useLocale();
  const intl = useIntl();
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Split recipe props first
  const recipe = useSlotRecipe({ recipe: numberInputRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps(restProps);

  // Extract style props
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  // Pass only functional props to react-aria with localized aria-labels
  const ariaProps = {
    ...functionalProps,
    incrementAriaLabel: intl.formatMessage(messages.increment),
    decrementAriaLabel: intl.formatMessage(messages.decrement),
  };

  const state = useNumberFieldState({ locale, ...ariaProps });
  const { inputProps, incrementButtonProps, decrementButtonProps } =
    useNumberField(ariaProps, state, ref);

  const stateProps = {
    "data-invalid": props.isInvalid,
    "data-disabled": props.isDisabled,
  };
  return (
    <NumberInputRootSlot {...recipeProps} {...styleProps} size={size}>
      {leadingElement && (
        <NumberInputLeadingElementSlot>
          {leadingElement}
        </NumberInputLeadingElementSlot>
      )}
      <NumberInputInputSlot
        ref={ref}
        {...inputProps}
        {...stateProps}
        size={size}
      />
      {trailingElement && (
        <NumberInputTrailingElementSlot>
          {trailingElement}
        </NumberInputTrailingElementSlot>
      )}
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
