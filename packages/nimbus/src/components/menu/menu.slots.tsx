import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  MenuRootSlotProps,
  MenuTriggerSlotProps,
  MenuPopoverSlotProps,
  MenuContentSlotProps,
  MenuItemSlotProps,
  MenuSectionSlotProps,
  MenuSectionLabelSlotProps,
  MenuSubmenuSlotProps,
} from "./menu.types";
import type { SlotComponent } from "../utils/slot-types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "menu",
});

// Menu Root
export const MenuRootSlot: SlotComponent<HTMLDivElement, MenuRootSlotProps> =
  withProvider<HTMLDivElement, MenuRootSlotProps>("div", "root");

// Menu Trigger
export const MenuTriggerSlot = withContext<
  HTMLButtonElement,
  MenuTriggerSlotProps
>("button", "trigger");

// Menu Popover
export const MenuPopoverSlot = withContext<
  HTMLDivElement,
  MenuPopoverSlotProps
>("div", "popover");

// Menu Content
export const MenuContentSlot = withContext<
  HTMLDivElement,
  MenuContentSlotProps
>("div", "content");

// Menu Item
export const MenuItemSlot = withContext<HTMLDivElement, MenuItemSlotProps>(
  "div",
  "item"
);

// Menu Section
export const MenuSectionSlot = withContext<
  HTMLDivElement,
  MenuSectionSlotProps
>("div", "section");

// Menu Section Label
export const MenuSectionLabelSlot = withContext<
  HTMLDivElement,
  MenuSectionLabelSlotProps
>("div", "sectionLabel");

// Menu Group Label
export const MenuSubmenuSlot = withContext<
  HTMLDivElement,
  MenuSubmenuSlotProps
>("div", "submenu");
