import { useRef } from "react";
import { mergeRefs } from "@/utils";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useNumberField, useLocale } from "react-aria";
import { useNumberFieldState } from "react-stately";
import { Box } from "@/components";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
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
import { numberInputMessagesStrings } from "./number-input.messages";
/**
 * # NumberInput
 *
 * A number input allows users to enter numerical values and adjust them incrementally.
 * The locale for formatting comes from React Aria's I18nProvider context.
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
  const msg = useLocalizedStringFormatter(numberInputMessagesStrings);
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
    incrementAriaLabel: msg.format("increment"),
    decrementAriaLabel: msg.format("decrement"),
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
    <NumberInputRootSlot
      className={props?.className as string}
      {...stateProps}
      {...recipeProps}
      {...styleProps}
      size={size}
    >
      {leadingElement && (
        <NumberInputLeadingElementSlot>
          {leadingElement}
        </NumberInputLeadingElementSlot>
      )}
      <NumberInputInputSlot
        ref={ref}
        {...inputProps}
        {...stateProps}
        // https://github.com/adobe/react-spectrum/issues/4744
        name={props.name}
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
