/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ReactElement, Ref } from "react";
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type ConfigRecipeSlots,
  type WithProviderOptions,
  type WithContextOptions,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import {
  ComboBox as RaComboBox,
  ListBox as RaListBox,
  GridList as RaGridList,
  ListBoxItem as RaListBoxItem,
  GridListItem as RaGridListItem,
  ListBoxSection as RaListBoxSection,
} from "react-aria-components";
import type {
  ComboBoxRootProps,
  ComboBoxRootComponent,
  ComboBoxOptionsProps,
  ComboBoxOptionsComponent,
  ComboBoxOptionProps,
  ComboBoxOptionComponent,
  ComboBoxOptionGroupProps,
  ComboBoxOptionGroupComponent,
} from "./combobox.types";

type ComboBoxSlotNames =
  | "root"
  | "trigger"
  | "input"
  | "tagGroup"
  | "options"
  | "optionGroup"
  | "option";

export const { withProvider, withContext } = createSlotRecipeContext({
  key: "combobox",
});

// ComboBox Root
// TODO: Change slot component based on multiselect props
export const ComboBoxRootSlot = <T extends object>(
  props: ComboBoxRootProps<T>,
  ref: Ref<HTMLDivElement>
): ReactElement<ComboBoxRootProps<T>, ComboBoxRootComponent<T>> => {
  const SlotComponent = withProvider<HTMLDivElement, ComboBoxRootProps<T>>(
    "div",
    "root"
  );

  return <SlotComponent {...props} ref={ref} />;
};

// Options - ListBox (single) or GridList (multi)
export const ComboBoxOptionsSlot = <T extends object>(
  props: ComboBoxOptionsProps<T>,
  ref: Ref<HTMLDivElement>
): ReactElement<ComboBoxOptionsProps<T>, ComboBoxOptionsComponent<T>> => {
  const SlotComponent =
    // props.selectionMode === "multiple"
    //   ? withContext<HTMLDivElement, ComboBoxOptionsProps<T>>(
    //       RaGridList,
    //       "options"
    //     )
    //   :
    withContext<HTMLDivElement, ComboBoxOptionsProps<T>>("div", "options");

  return <SlotComponent {...props} ref={ref} />;
};

// Option - ListBoxItem (single) or GridListItem (multi)
export const ComboBoxOptionSlot = <T extends object>(
  props: ComboBoxOptionProps<T>,
  ref: Ref<HTMLDivElement>
): ReactElement<ComboBoxOptionProps<T>, ComboBoxOptionComponent<T>> => {
  const SlotComponent = withContext<HTMLDivElement, ComboBoxOptionProps<T>>(
    "div",
    "option"
  );

  return <SlotComponent {...props} ref={ref} />;
};

// OptionGroup
export const ComboBoxOptionGroupSlot = <T extends object>(
  props: ComboBoxOptionGroupProps<T>,
  ref: Ref<HTMLDivElement>
): ReactElement<
  ComboBoxOptionGroupProps<T>,
  ComboBoxOptionGroupComponent<T>
> => {
  const SlotComponent = withContext<
    HTMLDivElement,
    ComboBoxOptionGroupProps<T>
  >(RaListBoxSection, "optionGroup");

  return <SlotComponent {...props} ref={ref} />;
};

// TODO: are these necessary?  we'll find out!

// Trigger Button
export interface ComboBoxTriggerSlotProps extends HTMLChakraProps<"button"> {}
export const ComboBoxTriggerSlot = withContext<
  HTMLButtonElement,
  ComboBoxTriggerSlotProps
>("button", "trigger");

// Input
export interface ComboBoxInputSlotProps extends HTMLChakraProps<"input"> {}
export const ComboBoxInputSlot = withContext<
  HTMLInputElement,
  ComboBoxInputSlotProps
>("input", "input");

// TagGroup
export interface ComboBoxTagGroupSlotProps extends HTMLChakraProps<"div"> {}
export const ComboBoxTagGroupSlot = withContext<
  HTMLUListElement,
  ComboBoxTagGroupSlotProps
>("div", "tagGroup");
