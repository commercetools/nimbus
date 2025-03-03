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
}

export type SelectOptionsProps<T = object> = Omit<
  RaListBoxProps<T>,
  keyof SelectOptionsSlotProps
> &
  SelectOptionsSlotProps;

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
