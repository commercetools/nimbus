import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react";
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

// Menu Separator
export type MenuSeparatorSlotProps = HTMLChakraProps<"div">;
export const MenuSeparatorSlot = withContext<
  HTMLDivElement,
  MenuSeparatorSlotProps
>("div", "separator");

// Menu Group
export type MenuGroupSlotProps = HTMLChakraProps<"div">;
export const MenuGroupSlot = withContext<HTMLDivElement, MenuGroupSlotProps>(
  "div",
  "group"
);

// Menu Group Label
export type MenuGroupLabelSlotProps = HTMLChakraProps<"div">;
export const MenuGroupLabelSlot = withContext<
  HTMLDivElement,
  MenuGroupLabelSlotProps
>("div", "groupLabel");

// Menu Group Label
export type MenuSubmenuSlotProps = HTMLChakraProps<"div">;
export const MenuSubmenuSlot = withContext<
  HTMLDivElement,
  MenuSubmenuSlotProps
>("div", "submenu");
