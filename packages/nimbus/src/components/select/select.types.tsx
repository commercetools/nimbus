import type { ReactNode } from "react";
import type {
  SelectOptionsSlotProps,
  SelectOptionSlotProps,
  SelectRootSlotProps,
  SelectOptionGroupSlotProps,
} from "./select.slots";

import {
  type SelectProps as RaSelectProps,
  type ListBoxProps as RaListBoxProps,
  type ListBoxItemProps as RaListBoxItemProps,
  type ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";

export interface SelectRootProps extends SelectRootSlotProps, RaSelectProps {
  /** set to true if Select is currently busy with something */
  isLoading?: boolean;
  /** Children must be ReactNode, no render props/functions allowed */
  children: ReactNode;
  /**
   * Optional element to display at the start of the input
   * Will respect text direction (left in LTR, right in RTL)
   */
  leadingElement?: ReactNode;
}

// Fix the incompatible event handler types by using a more specific type
export interface SelectOptionsProps<T>
  extends RaListBoxProps<T>,
    Omit<SelectOptionsSlotProps, keyof RaListBoxProps<T>> {}

export interface SelectOptionProps<T>
  extends Omit<RaListBoxItemProps<T>, keyof SelectOptionSlotProps>,
    SelectOptionSlotProps {}

export interface SelectOptionGroupProps<T>
  extends RaListBoxSectionProps<T>,
    Omit<SelectOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> {
  /** the label for the section */
  label: string;
}
