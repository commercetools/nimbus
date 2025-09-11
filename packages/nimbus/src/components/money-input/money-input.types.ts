import { type ReactNode } from "react";
import type {
  HTMLChakraProps,
  RecipeVariantProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { BoxProps } from "@/components";
import type { TValue } from "./utils";
import type { moneyInputRecipe } from "./money-input.recipe";

export type { TValue, TCurrencyCode, TMoneyValue } from "./utils";

// Slot prop types
export interface MoneyInputSlotRecipeProps
  extends RecipeVariantProps<typeof moneyInputRecipe>,
    UnstyledProp {}

export type MoneyInputRootSlotProps = HTMLChakraProps<
  "div",
  MoneyInputSlotRecipeProps
>;
export type MoneyInputContainerSlotProps = HTMLChakraProps<
  "div",
  MoneyInputSlotRecipeProps
>;
export type MoneyInputCurrencySelectSlotProps = HTMLChakraProps<
  "div",
  MoneyInputSlotRecipeProps
>;
export type MoneyInputCurrencyLabelSlotProps = HTMLChakraProps<
  "label",
  MoneyInputSlotRecipeProps
>;
export type MoneyInputAmountInputSlotProps = HTMLChakraProps<
  "input",
  MoneyInputSlotRecipeProps
>;
export type MoneyInputBadgeSlotProps = HTMLChakraProps<
  "div",
  MoneyInputSlotRecipeProps
>;

type TCustomEvent = {
  target: {
    id?: string;
    name?: string;
    value?: string | string[] | null;
  };
  persist?: () => void;
};

export interface MoneyInputRootProps
  extends Omit<BoxProps, "onChange" | "onBlur" | "onFocus"> {
  /**
   * Used as HTML id property. An id is auto-generated when it is not specified.
   */
  id?: string;
  /**
   * The prefix used to create a HTML `name` property for the amount input field (`${name}.amount`) and the currency dropdown (`${name}.currencyCode`).
   */
  name?: string;
  /**
   * Value of the input. Consists of the currency code and an amount. `amount` is a string representing the amount. A dot has to be used as the decimal separator.
   */
  value: TValue;
  /**
   * List of possible currencies. When not provided or empty, the component renders a label with the value's currency instead of a dropdown.
   */
  currencies?: string[];
  /**
   * Called when input is blurred
   */
  onBlur?: (event: TCustomEvent) => void;
  /**
   * Called when input is focused
   */
  onFocus?: (event: TCustomEvent) => void;
  /**
   * Called with the event of the input or dropdown when either the currency or the amount have changed.
   */
  onChange?: (event: TCustomEvent) => void;
  /**
   * Indicates that the input cannot be modified (e.g not authorized, or changes currently saving).
   */
  isDisabled?: boolean;
  /**
   * Indicates that the field is displaying read-only content
   */
  isReadOnly?: boolean;
  /**
   * Indicates that input has errors
   */
  hasError?: boolean;
  /**
   * Control to indicate on the input if there are selected values that are potentially invalid
   */
  hasWarning?: boolean;
  /**
   * Shows high precision badge in case current value uses high precision.
   */
  hasHighPrecisionBadge?: boolean;
  /**
   * Indicates that the currency input cannot be modified.
   */
  isCurrencyInputDisabled?: boolean;
  /**
   * Children components (AmountInput, CurrencySelect, Badge)
   */
  children: ReactNode;
}

export interface MoneyInputAmountInputProps {
  /**
   * Indicate if the value entered in the input is invalid.
   */
  "aria-invalid"?: boolean;
  /**
   * HTML ID of an element containing an error message related to the input.
   */
  "aria-errormessage"?: string;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Focus the input on initial render
   */
  isAutofocussed?: boolean;
}

export interface MoneyInputBadgeProps {
  /**
   * Override the default tooltip content
   */
  tooltipContent?: ReactNode;
}
