import type { ReactNode, FocusEvent } from "react";
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
}

// Fix the incompatible event handler types by using a more specific type
export type SelectOptionsProps<T = object> = Omit<
  RaListBoxProps<T>,
  keyof SelectOptionsSlotProps | "onFocus" | "onBlur"
> &
  SelectOptionsSlotProps & {
    // Specifically define onFocus and onBlur to ensure compatibility with both React and React Aria
    onFocus?: (e: FocusEvent<Element, Element>) => void;
    onBlur?: (e: FocusEvent<Element, Element>) => void;
  };

export type SelectOptionProps<T = object> = Omit<
  RaListBoxItemProps<T>,
  keyof SelectOptionSlotProps
> &
  SelectOptionSlotProps;

export type SelectOptionGroupProps<T = object> = Omit<
  RaListBoxSectionProps<T>,
  keyof SelectOptionGroupSlotProps
> &
  SelectOptionGroupSlotProps;
