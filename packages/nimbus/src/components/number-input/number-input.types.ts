import type { NumberInputRootSlotProps } from "./number-input.slots";
import type { AriaNumberFieldProps } from "react-aria";
import type { TCurrencyCode } from "./utils";

export type ExcludedNumberInputProps = "asChild" | "onChange";

export interface CurrencyNumberInputProps {
  /**
   * The currency code for formatting (ISO 4217)
   */
  currency?: TCurrencyCode | "";
  /**
   * Whether to show the currency symbol in the input.
   * Defaults to `true` when currency is provided, `false` when no currency.
   * Consumers can explicitly set this to `false` to hide the symbol even with currency.
   */
  showCurrencySymbol?: boolean;
  /**
   * Allow high precision decimal input even for zero-decimal currencies like JPY
   * When true, overrides standard currency step values to permit decimal entry
   */
  allowHighPrecision?: boolean;
}

export interface NumberInputProps
  extends AriaNumberFieldProps,
    Omit<
      NumberInputRootSlotProps,
      keyof AriaNumberFieldProps | ExcludedNumberInputProps
    >,
    CurrencyNumberInputProps {
  ref?: React.Ref<HTMLInputElement>;
}
