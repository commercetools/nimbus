import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { menuSlotRecipe } from "./menu.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: menuSlotRecipe,
});

// Menu Root
export type MenuRootSlotProps = HTMLChakraProps<"div">;
export const MenuRootSlot = withProvider<HTMLDivElement, MenuRootSlotProps>(
  "div",
  "root"
);

// Menu Trigger
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export const MenuTriggerSlot = withContext<
  HTMLButtonElement,
  MenuTriggerSlotProps
>("button", "trigger");

// Menu Popover
export type MenuPopoverSlotProps = HTMLChakraProps<"div">;
export const MenuPopoverSlot = withContext<
  HTMLDivElement,
  MenuPopoverSlotProps
>("div", "popover");

// Menu Content
export type MenuContentSlotProps = HTMLChakraProps<"div">;
export const MenuContentSlot = withContext<
  HTMLDivElement,
  MenuContentSlotProps
>("div", "content");

// Menu Item
export type MenuItemSlotProps = HTMLChakraProps<"div">;
export const MenuItemSlot = withContext<HTMLDivElement, MenuItemSlotProps>(
  "div",
  "item"
);


// Menu Section
export type MenuSectionSlotProps = HTMLChakraProps<"div">;
export const MenuSectionSlot = withContext<
  HTMLDivElement,
  MenuSectionSlotProps
>("div", "section");

// Menu Section Label
export type MenuSectionLabelSlotProps = HTMLChakraProps<"div">;
export const MenuSectionLabelSlot = withContext<
  HTMLDivElement,
  MenuSectionLabelSlotProps
>("div", "sectionLabel");

// Menu Group Label
export type MenuSubmenuSlotProps = HTMLChakraProps<"div">;
export const MenuSubmenuSlot = withContext<
  HTMLDivElement,
  MenuSubmenuSlotProps
>("div", "submenu");
