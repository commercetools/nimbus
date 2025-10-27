import type { ReactNode, Ref, RefObject } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  SlotRecipeProps,
} from "@chakra-ui/react";
import type {
  ComboBoxProps as RaComboBoxProps,
  AutocompleteProps as RaAutoCompleteProps,
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type React from "react";
import type { OmitUnwantedProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type ComboBoxRecipeVariantProps = {
  /**
   * Size variant of the combobox
   * @default "md"
   */
  size?: SlotRecipeProps<"combobox">["size"];
  /**
   * Visual style variant of the combobox
   * @default "solid"
   */
  variant?: SlotRecipeProps<"combobox">["variant"];
  /**
   * Selection mode for the combobox
   * @default "single"
   */
  selectionMode?: SlotRecipeProps<"combobox">["selectionMode"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ComboBoxSingleSelectRootSlotProps<T extends object> =
  HTMLChakraProps<
    "div",
    ComboBoxRecipeVariantProps & ComboBoxWithCustomChildren<T>
  >;

export type ComboBoxMultiSelectRootSlotProps<T extends object> =
  HTMLChakraProps<"div", ComboBoxRecipeVariantProps & ComboBoxMultiSelect<T>>;

export type ComboBoxValueSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"value">
>;

export type ComboBoxButtonGroupSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"buttonGroup">
>;

export type ComboBoxPopoverSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"popover">
>;

export type ComboBoxMultiSelectInputSlotProps = HTMLChakraProps<
  "input",
  RecipeProps<"multiSelectInput">
>;

export type ComboBoxOptionsSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"options">
>;

export type ComboBoxOptionGroupSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"div">
>;

export type ComboBoxOptionSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"div">
>;

export type ComboBoxOptionIndicatorSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"span">
>;

export type ComboBoxOptionContentSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"span">
>;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * ComboBox with overridden children prop based on expected dom structure.
 */
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

/**
 * MultiSelect combobox configuration
 */
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
    itemId?: string;
    itemValue?: string;
    placeholder?: string;
    ref?: Ref<HTMLDivElement>;
    leadingElement?: ReactNode;
    size?: ComboBoxRecipeVariantProps["size"];
  };

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the ComboBox.Root component in single select mode.
 */
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

/**
 * Props for the ComboBox.Root component in multi select mode.
 */
export type ComboBoxMultiSelectRootProps<T extends object> = Omit<
  ComboBoxMultiSelectRootSlotProps<T>,
  "selectionMode"
> &
  ComboBoxMultiSelect<T> & {
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Root element can either be single or multi select.
 */
export type ComboBoxRootProps<T extends object> =
  | OmitUnwantedProps<ComboBoxSingleSelectRootProps<T>>
  | OmitUnwantedProps<ComboBoxMultiSelectRootProps<T>>;

/**
 * Props for the internal ComboBox value display component (multi-select).
 */
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

/**
 * Props for the internal ComboBox button group component.
 */
export type ComboBoxButtonGroupProps = {
  selectedKeys?: ComboBoxMultiSelectRootProps<object>["selectedKeys"];
  onSelectionChange?: ComboBoxMultiSelectRootProps<object>["onSelectionChange"];
  onInputChange?: ComboBoxMultiSelectRootProps<object>["onInputChange"];
  onOpenChange?: ComboBoxSingleSelectRootProps<object>["onOpenChange"];
  containerRef?: RefObject<HTMLDivElement | null>;
  isOpen?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

/**
 * Props for the internal single select input component.
 */
export type SingleSelectInputProps = {
  placeholder?: string;
  inputValue?: string;
  allowsCustomValue?: boolean;
  onSubmitCustomValue?: (value: string) => void;
  onInputChange?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

/**
 * Props for the ComboBox.Options component.
 */
export type ComboBoxOptionsProps<T extends object> = RaListBoxProps<T> &
  Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the ComboBox.OptionGroup component.
 */
export type ComboBoxOptionGroupProps<T extends object> =
  RaListBoxSectionProps<T> &
    Omit<
      OmitUnwantedProps<ComboBoxOptionGroupSlotProps>,
      keyof RaListBoxSectionProps<T>
    > & {
      label?: ReactNode;
    };

/**
 * Props for the ComboBox.Option component.
 */
export type ComboBoxOptionProps<T extends object> = RaListBoxItemProps<T> &
  Omit<
    OmitUnwantedProps<ComboBoxOptionSlotProps>,
    keyof RaListBoxItemProps<T>
  > & {
    ref?: Ref<HTMLDivElement>;
  };
