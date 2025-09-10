import type { NumberInputRootSlotProps } from "./number-input.slots";
import type { AriaNumberFieldProps } from "react-aria";
import type { TCurrencyCode } from "./utils";

export type ExcludedNumberInputProps = "asChild" | "onChange";

export interface CurrencyNumberInputProps {
  /**
   * The currency code for formatting (ISO 4217)
   */
  currency?: TCurrencyCode | "";
  // TODO: make it on by default if the currency code is provided, but consumers can turn this off
  /**
   * Whether to show the currency symbol
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
