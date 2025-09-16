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
}
