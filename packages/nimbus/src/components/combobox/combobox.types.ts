/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ReactNode, Ref } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
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
  placeholder?: string;
  isLoading?: boolean;
  children: ReactNode | ((item: T) => React.ReactNode);
  ref?: Ref<HTMLDivElement>;
};

export interface ComboBoxMultiSelect<T extends object>
  extends Omit<RaAutoCompleteProps, "children">,
    Omit<RaListBoxProps<T>, "filter"> {
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  // name of key in items that is the unique id
  itemID?: string;
  // name of key in items that is the text value to display
  itemValue?: string;
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
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

export type ComboBoxRootProps<T extends object> =
  | ComboBoxSingleSelectRootProps<T>
  | ComboBoxMultiSelectRootProps<T>;

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
// OptionGroup Sub-Component (`<ComboBox.OptionGroup>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionGroupSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the tag element (Chakra styles + Aria behavior + Recipe variants). */
export interface ComboBoxOptionGroupProps<T extends object>
  extends RaListBoxSectionProps<T>,
    Omit<ComboBoxOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> {
  label?: ReactNode;
}

// ============================================================
// Multi Select Value Slot - internal, not exported in compound component
// ============================================================

export type ComboBoxMultiSelectValueProps<T extends object> = {
  items: ComboBoxMultiSelectRootProps<T>["items"];
  itemID: ComboBoxMultiSelectRootProps<T>["itemID"];
  itemValue: ComboBoxMultiSelectRootProps<T>["itemValue"];
  selectedKeys: ComboBoxMultiSelectRootProps<T>["selectedKeys"];
  onSelectionChange: ComboBoxMultiSelectRootProps<T>["onSelectionChange"];
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
};

// ============================================================
// Button Group Slot - internal, not exported in compound component
// ============================================================

export type ComboBoxButtonGroupProps = {
  selectedKeys?: ComboBoxMultiSelectRootProps<{}>["selectedKeys"];
  onSelectionChange?: ComboBoxMultiSelectRootProps<{}>["onSelectionChange"];
  onInputChange?: ComboBoxMultiSelectRootProps<{}>["onInputChange"];
  isLoading?: boolean;
};

// /** Base Chakra styling props for the root `button` slot. */
// type ComboBoxOptionsSlotProps = HTMLChakraProps<"div", RecipeProps<"button">>;

// /** Combined props for the tagList element (Chakra styles + Aria behavior + Recipe variants). */
// export type ComboBoxListBoxProps<T extends object> = RaListBoxProps<T> &
//   Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>>;

// /** Type signature for the `ComboBox.ListBox` sub-component (using `forwardRef`). */
// export type ComboBoxListBoxComponent<T extends object> = FC<
//   ComboBoxListBoxProps<T> & RefAttributes<HTMLDivElement>
// >;
