/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { listBoxSlotRecipe } from "./list-box.recipe";
import { type ListBoxProps as RaListBoxProps } from "react-aria-components";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: listBoxSlotRecipe,
});

// ListBox Root
export interface ListBoxRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof listBoxSlotRecipe> & RaListBoxProps<object>
  > {}
export const ListBoxRootSlot = withProvider<
  HTMLDivElement,
  ListBoxRootSlotProps
>("div", "root");

// ListBox Item
export interface ListBoxItemSlotProps extends HTMLChakraProps<"div"> {}
export const ListBoxItemSlot = withContext<
  HTMLDivElement,
  ListBoxItemSlotProps
>("div", "item");

// ListBox Item Label
export interface ListBoxItemLabelSlotProps extends HTMLChakraProps<"span"> {}
export const ListBoxItemLabelSlot = withContext<
  HTMLSpanElement,
  ListBoxItemLabelSlotProps
>("span", "itemLabel");

// ListBox Item Description
export interface ListBoxItemDescriptionSlotProps
  extends HTMLChakraProps<"span"> {}
export const ListBoxItemDescriptionSlot = withContext<
  HTMLSpanElement,
  ListBoxItemDescriptionSlotProps
>("span", "itemDescription");

// ListBox Section
export interface ListBoxSectionSlotProps extends HTMLChakraProps<"div"> {}
export const ListBoxSectionSlot = withContext<
  HTMLDivElement,
  ListBoxSectionSlotProps
>("div", "section");

// ListBox Section Header
export interface ListBoxSectionHeaderSlotProps extends HTMLChakraProps<"div"> {}
export const ListBoxSectionHeaderSlot = withContext<
  HTMLDivElement,
  ListBoxSectionHeaderSlotProps
>("div", "sectionHeader");
