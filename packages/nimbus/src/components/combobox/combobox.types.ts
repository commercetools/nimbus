/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ReactNode, Ref, RefObject } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import type {
  ComboBoxProps as RaComboBoxProps,
  AutocompleteProps as RaAutoCompleteProps,
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";

import { comboBoxSlotRecipe } from "./combobox.recipe";
import type React from "react";

// ============================================================
// Root Component (`<ComboBox.Root>`)
// ============================================================
/** ComboBox with overridden children prop based on expected dom structure. */
type ComboBoxWithCustomChildren<T extends object> = Omit<
  RaComboBoxProps<T>,
  "children"
> & {
  onSubmitCustomValue?: (value: string) => void;
  renderEmptyState?: RaListBoxProps<T>["renderEmptyState"];
  placeholder?: string;
  isLoading?: boolean;
  children: ReactNode | ((item: T) => React.ReactNode);
  ref?: Ref<HTMLDivElement>;
};
/** MultiSelect combobox */
export interface ComboBoxMultiSelect<T extends object>
  extends Omit<RaAutoCompleteProps, "children" | "filter" | "slot">,
    Omit<RaListBoxProps<T>, "filter" | "autoFocus" | "style" | "slot"> {
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  defaultInputValue?: RaComboBoxProps<T>["defaultInputValue"];
  defaultItems?: RaComboBoxProps<T>["defaultItems"];
  validate?: RaComboBoxProps<T>["validate"];
  allowsCustomValue?: boolean;
  onSubmitCustomValue?: (value: string) => void;
  onOpenChange?: RaComboBoxProps<T>["onOpenChange"];
  autoFocus?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  // name of key in items that is the unique id
  itemId?: string;
  // name of key in items that is the text value to display
  itemValue?: string;
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
  size?: RecipeVariantProps<typeof comboBoxSlotRecipe>["size"];
}
/** Base Chakra styling props for the root `div` slot when single select*/
export interface ComboBoxSingleSelectRootSlotProps<T extends object>
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof comboBoxSlotRecipe> &
      ComboBoxWithCustomChildren<T>
  > {}
/** Combined props for the single select root element (Chakra styles + Aria behavior + Recipe variants). */
export interface ComboBoxSingleSelectRootProps<T extends object>
  extends ComboBoxSingleSelectRootSlotProps<T>,
    ComboBoxWithCustomChildren<T> {
  ref?: Ref<HTMLDivElement>;
}
/** Base Chakra styling props for the root `div` slot when multi select*/
export interface ComboBoxMultiSelectRootSlotProps<T extends object>
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof comboBoxSlotRecipe> & ComboBoxMultiSelect<T>
  > {}
/** Combined props for the multi select root element (Chakra styles + Aria behavior + Recipe variants). */
export interface ComboBoxMultiSelectRootProps<T extends object>
  extends Omit<ComboBoxMultiSelectRootSlotProps<T>, "selectionMode">,
    ComboBoxMultiSelect<T> {
  ref?: Ref<HTMLDivElement>;
}
/** Root element can either be single or multi select */
export type ComboBoxRootProps<T extends object> =
  | ComboBoxSingleSelectRootProps<T>
  | ComboBoxMultiSelectRootProps<T>;

// ============================================================
// Value Slot - internal, not exported in compound component
// ============================================================
/** The slot is a wrapper for multiple components,
 *  and therefore not combined with the component props
 *  because it is not used to style the component directly using asChild */
export interface ComboBoxValueSlotProps
  extends HTMLChakraProps<"div", RecipeProps<"value">> {}
/** component prop interface */
export type ComboBoxMultiSelectValueProps<T extends object> = {
  items: ComboBoxMultiSelectRootProps<T>["items"];
  itemId: ComboBoxMultiSelectRootProps<T>["itemId"];
  itemValue: ComboBoxMultiSelectRootProps<T>["itemValue"];
  selectedKeys: ComboBoxMultiSelectRootProps<T>["selectedKeys"];
  onSelectionChange: ComboBoxMultiSelectRootProps<T>["onSelectionChange"];
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  ref?: Ref<HTMLDivElement>;
  containerRef?: RefObject<HTMLDivElement | null>;
  size?: RecipeVariantProps<typeof comboBoxSlotRecipe>["size"];
};

// ============================================================
// Button Group Slot - internal, not exported in compound component
// ============================================================
/** The slot is a wrapper for multiple components,
 *  and therefore not combined with the component props
 *  because it is not used to style the component directly using asChild */
export interface ComboBoxButtonGroupSlotProps
  extends HTMLChakraProps<"div", RecipeProps<"buttonGroup">> {}
/** component prop interface */
export type ComboBoxButtonGroupProps = {
  selectedKeys?: ComboBoxMultiSelectRootProps<{}>["selectedKeys"];
  onSelectionChange?: ComboBoxMultiSelectRootProps<{}>["onSelectionChange"];
  onInputChange?: ComboBoxMultiSelectRootProps<{}>["onInputChange"];
  onOpenChange?: ComboBoxSingleSelectRootProps<{}>["onOpenChange"];
  containerRef?: RefObject<HTMLDivElement | null>;
  isOpen?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

// ============================================================
// Popover Slot - internal, not exported in compound component
// ============================================================
export interface ComboBoxPopoverSlotProps
  extends HTMLChakraProps<"div", RecipeProps<"popover">> {}

// ============================================================
// MultiSelect Input Slot - internal, not exported in compound component
// ============================================================
export interface ComboBoxMultiSelectInputSlotProps
  extends HTMLChakraProps<"input", RecipeProps<"multiSelectInput">> {}

// ============================================================
// SingleSelect Input Slot - internal, not exported in compound component
// ============================================================
export interface SingleSelectInputProps {
  placeholder?: string;
  inputValue?: string;
  allowsCustomValue?: boolean;
  onSubmitCustomValue?: (value: string) => void;
  onInputChange?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
}
// ============================================================
// Options Sub-Component (`<ComboBox.Options>`)
// ============================================================
/** Base Chakra styling props for the root `div` slot. */
export interface ComboBoxOptionsSlotProps
  extends HTMLChakraProps<"div", RecipeProps<"options">> {}
/** Combined props for the ListBox element used in Single Select (Chakra styles + Aria behavior + Recipe variants) */
export interface ComboBoxOptionsProps<T extends object>
  extends RaListBoxProps<T>,
    Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>> {
  ref?: Ref<HTMLDivElement>;
}

// ============================================================
// OptionGroup Sub-Component (`<ComboBox.OptionGroup>`)
// ============================================================
/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionGroupSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;
/** Combined props for the OptionGroup element (Chakra styles + Aria behavior + Recipe variants). */
export interface ComboBoxOptionGroupProps<T extends object>
  extends RaListBoxSectionProps<T>,
    Omit<ComboBoxOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> {
  label?: ReactNode;
}

// ============================================================
// Option Sub-Component (`<ComboBox.Option>`)
// ============================================================
/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;
/** Combined props for the ListBoxItem element (Chakra styles + Aria behavior + Recipe variants). */
export interface ComboBoxOptionProps<T extends object>
  extends RaListBoxItemProps<T>,
    Omit<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>> {
  ref?: Ref<HTMLDivElement>;
}

// ============================================================
// Option Indicator Slot - internal, not exported in compound component
// ============================================================
export type ComboBoxOptionIndicatorSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"span">
>;

// ============================================================
// Option Content Slot - internal, not exported in compound component
// ============================================================
export type ComboBoxOptionContentSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"span">
>;
