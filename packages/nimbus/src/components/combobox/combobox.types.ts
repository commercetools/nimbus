/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ReactNode, Ref, RefObject } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";
import type {
  ComboBoxProps as RaComboBoxProps,
  AutocompleteProps as RaAutoCompleteProps,
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type React from "react";

type ComboBoxRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Variant variant
   * @default "solid"
   */
  variant?: "solid" | "ghost";
  /**
   * SelectionMode variant
   * @default "single"
   */
  selectionMode?: "multiple" | "single" | "none";
};

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
export type ComboBoxMultiSelect<T extends object> = Omit<
  RaAutoCompleteProps,
  "children" | "filter" | "slot"
> &
  Omit<RaListBoxProps<T>, "filter" | "autoFocus" | "style" | "slot"> & {
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
    /**
     * Optional element to display at the start of the input
     * Will respect text direction (left in LTR, right in RTL)
     */
    leadingElement?: ReactNode;
    size?: ComboBoxRecipeVariantProps["size"];
  };

/** Base Chakra styling props for the root `div` slot when single select*/
export type ComboBoxSingleSelectRootSlotProps<T extends object> =
  HTMLChakraProps<
    "div",
    ComboBoxRecipeVariantProps & ComboBoxWithCustomChildren<T>
  >;

/** Combined props for the single select root element (Chakra styles + Aria behavior + Recipe variants). */
export type ComboBoxSingleSelectRootProps<T extends object> =
  ComboBoxSingleSelectRootSlotProps<T> &
    ComboBoxWithCustomChildren<T> & {
      ref?: Ref<HTMLDivElement>;
      /**
       * Optional element to display at the start of the input
       * Will respect text direction (left in LTR, right in RTL)
       */
      leadingElement?: ReactNode;
    };
/** Base Chakra styling props for the root `div` slot when multi select*/
export type ComboBoxMultiSelectRootSlotProps<T extends object> =
  HTMLChakraProps<"div", ComboBoxRecipeVariantProps & ComboBoxMultiSelect<T>>;
/** Combined props for the multi select root element (Chakra styles + Aria behavior + Recipe variants). */
export type ComboBoxMultiSelectRootProps<T extends object> = Omit<
  ComboBoxMultiSelectRootSlotProps<T>,
  "selectionMode"
> &
  ComboBoxMultiSelect<T> & {
    ref?: Ref<HTMLDivElement>;
  };
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
export type ComboBoxValueSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"value">
>;
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
  size?: ComboBoxRecipeVariantProps["size"];
  /**
   * Optional element to display at the start of the input
   * Will respect text direction (left in LTR, right in RTL)
   */
  leadingElement?: ReactNode;
};

// ============================================================
// Button Group Slot - internal, not exported in compound component
// ============================================================
/** The slot is a wrapper for multiple components,
 *  and therefore not combined with the component props
 *  because it is not used to style the component directly using asChild */
export type ComboBoxButtonGroupSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"buttonGroup">
>;
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
export type ComboBoxPopoverSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"popover">
>;

// ============================================================
// MultiSelect Input Slot - internal, not exported in compound component
// ============================================================
export type ComboBoxMultiSelectInputSlotProps = HTMLChakraProps<
  "input",
  RecipeProps<"multiSelectInput">
>;

// ============================================================
// SingleSelect Input Slot - internal, not exported in compound component
// ============================================================
export type SingleSelectInputProps = {
  placeholder?: string;
  inputValue?: string;
  allowsCustomValue?: boolean;
  onSubmitCustomValue?: (value: string) => void;
  onInputChange?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};
// ============================================================
// Options Sub-Component (`<ComboBox.Options>`)
// ============================================================
/** Base Chakra styling props for the root `div` slot. */
export type ComboBoxOptionsSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"options">
>;
/** Combined props for the ListBox element used in Single Select (Chakra styles + Aria behavior + Recipe variants) */
export type ComboBoxOptionsProps<T extends object> = RaListBoxProps<T> &
  Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

// ============================================================
// OptionGroup Sub-Component (`<ComboBox.OptionGroup>`)
// ============================================================
/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionGroupSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;
/** Combined props for the OptionGroup element (Chakra styles + Aria behavior + Recipe variants). */
export type ComboBoxOptionGroupProps<T extends object> =
  RaListBoxSectionProps<T> &
    Omit<ComboBoxOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> & {
      label?: ReactNode;
    };

// ============================================================
// Option Sub-Component (`<ComboBox.Option>`)
// ============================================================
/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;
/** Combined props for the ListBoxItem element (Chakra styles + Aria behavior + Recipe variants). */
export type ComboBoxOptionProps<T extends object> = RaListBoxItemProps<T> &
  Omit<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

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
