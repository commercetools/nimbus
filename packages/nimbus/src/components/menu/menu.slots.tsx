import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { menuSlotRecipe } from "./menu.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: menuSlotRecipe,
});

// Menu Root
export type MenuRootSlotProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof menuSlotRecipe>
>;
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

// Menu Item Label
export type MenuItemLabelSlotProps = HTMLChakraProps<"span">;
export const MenuItemLabelSlot = withContext<
  HTMLSpanElement,
  MenuItemLabelSlotProps
>("span", "itemLabel");

// Menu Item Description
export type MenuItemDescriptionSlotProps = HTMLChakraProps<"span">;
export const MenuItemDescriptionSlot = withContext<
  HTMLSpanElement,
  MenuItemDescriptionSlotProps
>("span", "itemDescription");

// Menu Item Keyboard Shortcut
export type MenuItemKeyboardSlotProps = HTMLChakraProps<"span">;
export const MenuItemKeyboardSlot = withContext<
  HTMLSpanElement,
  MenuItemKeyboardSlotProps
>("span", "itemKeyboard");

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
