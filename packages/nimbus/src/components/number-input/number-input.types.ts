import type { NumberInputRootSlotProps } from "./number-input.slots";
import type { AriaNumberFieldProps } from "react-aria";

export type ExcludedNumberInputProps = "asChild" | "onChange";

export interface NumberInputProps
  extends AriaNumberFieldProps,
    Omit<
      NumberInputRootSlotProps,
      keyof AriaNumberFieldProps | ExcludedNumberInputProps
    > {
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Optional element to display at the start of the input
   * Will respect text direction (left in LTR, right in RTL)
   */
  leadingElement?: React.ReactNode;

  /**
   * Optional element to display at the end of the input
   * Will respect text direction (right in LTR, left in RTL)
   */
  trailingElement?: React.ReactNode;
}
