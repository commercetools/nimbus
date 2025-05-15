/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ReactNode } from "react";
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

import { comboBoxSlotRecipe } from "./combobox.recipe";

// ============================================================
// Root Component (`<ComboBox.Root>`)
// ============================================================
/** ComboBox with overridden children prop based on expected dom structure. */
type ComboBoxWithCustomChildren<T extends object> = Omit<
  RaComboBoxProps<T>,
  "children"
> & {
  isLoading?: boolean;
  children: ReactNode | ((item: T) => React.ReactNode);
};
/** Base Chakra styling props for the root `div` slot. */
export interface ComboBoxRootSlotProps<T extends object>
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof comboBoxSlotRecipe> &
      ComboBoxWithCustomChildren<T>
  > {}
/** Combined props for the root element (Chakra styles + Aria behavior + Recipe variants). */
export interface ComboBoxRootProps<T extends object>
  extends ComboBoxRootSlotProps<T>,
    ComboBoxWithCustomChildren<T> {}

// ============================================================
// Options Sub-Component (`<ComboBox.Options>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
export interface ComboBoxOptionsSlotProps
  extends HTMLChakraProps<"div", RecipeProps<"options">> {}
/** Combined props for the ListBox element used in Single Select (Chakra styles + Aria behavior + Recipe variants) */
interface ComboBoxListBoxProps<T extends object>
  extends RaListBoxProps<T>,
    Omit<ComboBoxOptionsSlotProps, keyof RaListBoxProps<T>> {}
/** Combined props for the GridList element used in Multi Select (Chakra styles + Aria behavior + Recipe variants) */
interface ComboBoxGridListProps<T extends object>
  extends RaGridListProps<T>,
    Omit<ComboBoxOptionsSlotProps, keyof RaGridListProps<T>> {}
/** Union type of ListBox or Gridlist, since slot could use either as base component  */
export type ComboBoxOptionsProps<T extends object> =
  | ComboBoxListBoxProps<T>
  | ComboBoxGridListProps<T>;

// ============================================================
// Option Sub-Component (`<ComboBox.Option>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type ComboBoxOptionSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;
/** Combined props for the ListBoxItem element (Chakra styles + Aria behavior + Recipe variants). */
interface ComboBoxListBoxItemProps<T extends object>
  extends RaListBoxItemProps<T>,
    Omit<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>> {
  selectionMode?: RaSelectionMode;
}
/** Combined props for the GridListItem element (Chakra styles + Aria behavior + Recipe variants). */
interface ComboBoxGridListItemProps<T extends object>
  extends RaGridListItemProps<T>,
    Omit<ComboBoxOptionSlotProps, keyof RaGridListItemProps<T>> {
  selectionMode?: RaSelectionMode;
}
/** Union type of ListBox or Gridlist, since slot could use either as base component  */
export type ComboBoxOptionProps<T extends object> =
  | ComboBoxListBoxItemProps<T>
  | ComboBoxGridListItemProps<T>;

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
