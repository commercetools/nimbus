import type {
  HTMLChakraProps,
  RecipeVariantProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { TValue, TCurrencyCode } from "./utils";
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

export type TCustomEvent = {
  target: {
    id?: string;
    name?: string;
    value?: string | string[] | null;
  };
};

// Props to exclude from slot props that conflict with our custom event handling
export type ExcludedSlotProps =
  | "asChild"
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "id"
  | "name"
  | "value"
  // Consumers should not be able to set step, it causes issues with high precision
  | "step";

// Main component API interface - extends slot props to include style props
export interface MoneyInputProps
  extends Omit<MoneyInputRootSlotProps, ExcludedSlotProps> {
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
   * @deprecated Use onValueChange, onAmountChange, or onCurrencyChange for better type safety and developer experience.
   */
  onChange?: (event: TCustomEvent) => void;
  /**
   * Modern API: Called when the complete value (amount + currency) changes.
   * This is the recommended handler for most use cases.
   */
  onValueChange?: (value: TValue) => void;
  /**
   * Modern API: Called when only the amount changes.
   * Use this for granular control over amount changes.
   */
  onAmountChange?: (amount: string) => void;
  /**
   * Modern API: Called when only the currency changes.
   * Use this for granular control over currency changes.
   */
  onCurrencyChange?: (currencyCode: TCurrencyCode) => void;
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
  isInvalid?: boolean;
  /**
   * Indicates that the field is required
   */
  isRequired?: boolean;
  /**
   * Shows high precision badge in case current value uses high precision.
   */
  hasHighPrecisionBadge?: boolean;
  /**
   * Indicates that the currency input cannot be modified.
   */
  isCurrencyInputDisabled?: boolean;
  /**
   * Placeholder text for the amount input
   */
  placeholder?: string;
  /**
   * Focus the input on initial render
   */
  autoFocus?: boolean;
  /**
   * Size variant for the input
   */
  size?: RecipeVariantProps<typeof moneyInputRecipe>["size"];
}
