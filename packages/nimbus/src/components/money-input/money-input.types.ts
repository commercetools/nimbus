import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react/styled-system";
import type { MoneyInputValue, CurrencyCode } from "./utils";
import type { OmitInternalProps } from "../../type-utils/omit-props";

export type { MoneyInputValue, CurrencyCode, MoneyValue } from "./utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type MoneyInputRecipeProps = {
  /**
   * Size variant of the money input
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusMoneyInput">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================
export type MoneyInputRootSlotProps = HTMLChakraProps<
  "div",
  MoneyInputRecipeProps
>;
export type MoneyInputContainerSlotProps = HTMLChakraProps<"div">;
export type MoneyInputCurrencySelectSlotProps = HTMLChakraProps<"div">;
export type MoneyInputCurrencyLabelSlotProps = HTMLChakraProps<"label">;
export type MoneyInputAmountInputSlotProps = HTMLChakraProps<"input">;
export type MoneyInputBadgeSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

export type CustomEvent = {
  target: {
    id?: string;
    name?: string;
    value?: string | string[] | null;
  };
};

// Props to exclude from slot props that conflict with our custom event handling
export type ExcludedSlotProps =
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "id"
  | "name"
  | "value"
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
  // It's best if we don't use step at all to preserve high precision.
  | "step";

// ============================================================
// MAIN PROPS
// ============================================================
export type MoneyInputProps = OmitInternalProps<
  MoneyInputRootSlotProps,
  ExcludedSlotProps
> & {
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
  value: MoneyInputValue;
  /**
   * List of possible currencies. When not provided or empty, the component renders a label with the value's currency instead of a dropdown.
   */
  currencies?: string[];
  /**
   * Called when input is blurred
   */
  onBlur?: (event: CustomEvent) => void;
  /**
   * Called when input is focused
   */
  onFocus?: (event: CustomEvent) => void;
  /**
   * Called with the event of the input or dropdown when either the currency or the amount have changed.
   * @deprecated Use onValueChange, onAmountChange, or onCurrencyChange for better type safety and developer experience.
   */
  onChange?: (event: CustomEvent) => void;
  /**
   * Modern API: Called when the complete value (amount + currency) changes.
   * This is the recommended handler for most use cases.
   */
  onValueChange?: (value: MoneyInputValue) => void;
  /**
   * Modern API: Called when only the amount changes.
   * Use this for granular control over amount changes.
   */
  onAmountChange?: (amount: string) => void;
  /**
   * Modern API: Called when only the currency changes.
   * Use this for granular control over currency changes.
   */
  onCurrencyChange?: (currencyCode: CurrencyCode) => void;
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
};
