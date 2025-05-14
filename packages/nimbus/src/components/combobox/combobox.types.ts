import type { ReactNode, RefAttributes, FC } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import type {
  ComboBoxProps as RaComboBoxProps,
  ListBoxProps as RaListBoxProps,
  GridListProps as RaGridListProps,
  ListBoxItemProps as RaListBoxItemProps,
  GridListItemProps as RaGridListItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
  SelectionMode as RaSelectionMode,
} from "react-aria-components";
import type { IconButtonProps } from "@/components";
import { comboBoxSlotRecipe } from "./combobox.recipe";

// ============================================================
// Root Component (`<ComboBox.Root>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ComboBoxRootSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the root element (Chakra styles + Aria behavior + Recipe variants). */
export type ComboBoxRootProps<T extends object> = Omit<
  RaComboBoxProps<T>,
  "children"
> & {
  children: React.ReactNode | ((item: T) => React.ReactNode);
};

/** Type signature for the main `ComboBox` single-select component (using `forwardRef`). */
export type ComboBoxRootComponent<T extends object> = FC<
  ComboBoxRootProps<T> &
    RefAttributes<HTMLDivElement> & {
      children: React.ReactNode | ((item: T) => React.ReactNode);
    }
>;

// ============================================================
// Options Sub-Component (`<ComboBox.Options>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionsSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the ListBox element used in Single Select (Chakra styles + Aria behavior + Recipe variants) */
type ComboBoxListBoxProps<T extends object> = RaListBoxProps<T> &
  Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>>;

/** Combined props for the GridList element used in Multi Select (Chakra styles + Aria behavior + Recipe variants) */
type ComboBoxGridListProps<T extends object> = RaGridListProps<T> &
  Omit<ComboBoxOptionsSlotProps, keyof RaGridListProps<T>>;

/** Union type of ListBox or Gridlist, since slot could use either as base component  */
export type ComboBoxOptionsProps<T extends object> = ComboBoxListBoxProps<T>;

/** Type signature for the `ComboBox.Options` sub-component (using `forwardRef`). */
export type ComboBoxOptionsComponent<T extends object> = FC<
  ComboBoxOptionsProps<T> & RefAttributes<HTMLDivElement>
>;

// ============================================================
// Option Sub-Component (`<ComboBox.Option>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the ListBoxItem element (Chakra styles + Aria behavior + Recipe variants). */
type ComboBoxListBoxItemProps<T extends object> = RaListBoxItemProps<T> &
  Omit<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>>;

/** Combined props for the GridListItem element (Chakra styles + Aria behavior + Recipe variants). */
type ComboBoxGridListItemProps<T extends object> = RaGridListItemProps<T> &
  Omit<ComboBoxOptionSlotProps, keyof RaGridListItemProps<T>>;

/** Union type of ListBox or Gridlist, since slot could use either as base component  */
export type ComboBoxOptionProps<T extends object> =
  ComboBoxListBoxItemProps<T> & { selectionMode?: RaSelectionMode };

/** Type signature for the `ComboBox.Option` sub-component (using `forwardRef`). */
export type ComboBoxOptionComponent<T extends object> = FC<
  ComboBoxOptionProps<T> & RefAttributes<HTMLDivElement>
>;

// ============================================================
// OptionGroup Sub-Component (`<ComboBox.OptionGroup>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionGroupSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the tag element (Chakra styles + Aria behavior + Recipe variants). */
export type ComboBoxOptionGroupProps<T extends object> =
  RaListBoxSectionProps<T> &
    Omit<ComboBoxOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> & {
      label?: ReactNode;
    };

/** Type signature for the `ComboBox.OptionGroup` sub-component (using `forwardRef`). */
export type ComboBoxOptionGroupComponent<T extends object> = FC<
  ComboBoxOptionGroupProps<T> & RefAttributes<HTMLDivElement>
>;

// ============================================================
// Trigger Slot - internal, not exported in compound component
// ============================================================

// /** Base Chakra styling props for the root `button` slot. */
// type ComboBoxOptionsSlotProps = HTMLChakraProps<"div", RecipeProps<"button">>;

// /** Combined props for the tagList element (Chakra styles + Aria behavior + Recipe variants). */
// export type ComboBoxListBoxProps<T extends object> = RaListBoxProps<T> &
//   Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>>;

// /** Type signature for the `ComboBox.ListBox` sub-component (using `forwardRef`). */
// export type ComboBoxListBoxComponent<T extends object> = FC<
//   ComboBoxListBoxProps<T> & RefAttributes<HTMLDivElement>
// >;
