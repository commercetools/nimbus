import { useRef, useMemo } from "react";
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
  getCurrencyFormatOptions,
  getCurrencyStep,
  getHighPrecisionFormatOptions,
} from "./utils";
import {
  NumberInputRootSlot,
  NumberInputInputSlot,
  NumberInputIncrementButtonSlot,
  NumberInputDecrementButtonSlot,
} from "./number-input.slots";
import type { NumberInputProps } from "./number-input.types";
import { numberInputRecipe } from "./number-input.recipe";
/**
 * # NumberInput
 *
 * A number input allows users to enter numerical values and adjust them incrementally.
 * When used with currency, the locale for formatting comes from React Aria's I18nProvider context.
 */
export const NumberInput = (props: NumberInputProps) => {
  const {
    size,
    ref: forwardedRef,
    currency,
    showCurrencySymbol = true,
    allowHighPrecision = false,
    ...restProps
  } = props;
  const { locale } = useLocale();

  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Create currency-aware format options
  const formatOptions = useMemo(() => {
    if (!currency) return undefined;

    // For high precision mode without currency symbol (like MoneyInput),
    // use decimal formatting to avoid conflicts with currency step values
    if (allowHighPrecision && !showCurrencySymbol) {
      return getHighPrecisionFormatOptions(currency);
    }

    // For currency display, use currency formatting with precision support
    if (showCurrencySymbol) {
      return getCurrencyFormatOptions(currency, allowHighPrecision);
    }

    return undefined;
  }, [currency, locale, showCurrencySymbol, allowHighPrecision]);

  // Get currency-appropriate step value
  const currencyStep = useMemo(() => {
    if (!currency) return undefined;
    return getCurrencyStep(currency, allowHighPrecision);
  }, [currency, allowHighPrecision]);

  // Split recipe props first
  const recipe = useSlotRecipe({ recipe: numberInputRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps(restProps);

  // Extract style props
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  // Enhance functional props with currency-aware settings
  const enhancedFunctionalProps = {
    ...functionalProps,
    locale: locale,
    formatOptions,
    ...(currencyStep && { step: currencyStep }),
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
