import type { ReactNode } from "react";
import type {
  ComboBoxRootSlotProps,
  ComboBoxListBoxSlotProps,
  ComboBoxOptionSlotProps,
  ComboBoxOptionGroupSlotProps,
} from "./combobox.slots";

import type {
  // TagProps as RaTagProps,
  // TagGroupProps as RaTagGroupProps,
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
  Selection as RaSelection,
  Key as RaKey,
  SelectionMode as RaSelectionMode,
} from "react-aria-components";

export interface ComboBoxRootProps
  // custom onSelectionChange for handling both single and multi select
  extends Omit<ComboBoxRootSlotProps, "onSelectionChange"> {
  isLoading?: boolean;
  children: ReactNode;
  selectionMode?: RaSelectionMode;
  selectedKeys?: RaSelection;
  defaultSelectedKeys?: RaSelection;
  onSelectionChange?: (keys?: RaSelection | null) => void;
}

export interface ComboBoxListBoxProps<T>
  extends RaListBoxProps<T>,
    Omit<ComboBoxListBoxSlotProps, keyof RaListBoxProps<T>> {}

export interface ComboBoxOptionProps<T>
  extends RaListBoxItemProps<T>,
    Omit<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>> {
  variant?: ComboBoxRootSlotProps["variant"];
}

export interface ComboBoxOptionGroupProps<T>
  extends RaListBoxSectionProps<T>,
    Omit<ComboBoxOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> {
  label: ReactNode;
}
