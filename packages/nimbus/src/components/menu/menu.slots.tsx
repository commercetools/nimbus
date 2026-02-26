import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
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

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusMenu",
});

// Menu Root
export const MenuRootSlot: SlotComponent<HTMLDivElement, MenuRootSlotProps> =
  withProvider<HTMLDivElement, MenuRootSlotProps>("div", "root");

// Menu Trigger
export const MenuTriggerSlot: SlotComponent<
  HTMLButtonElement,
  MenuTriggerSlotProps
> = withContext<HTMLButtonElement, MenuTriggerSlotProps>("button", "trigger");

// Menu Popover
export const MenuPopoverSlot: SlotComponent<
  HTMLDivElement,
  MenuPopoverSlotProps
> = withContext<HTMLDivElement, MenuPopoverSlotProps>("div", "popover");

// Menu Content
export const MenuContentSlot: SlotComponent<
  HTMLDivElement,
  MenuContentSlotProps
> = withContext<HTMLDivElement, MenuContentSlotProps>("div", "content");

// Menu Item
export const MenuItemSlot: SlotComponent<HTMLDivElement, MenuItemSlotProps> =
  withContext<HTMLDivElement, MenuItemSlotProps>("div", "item");

// Menu Section
export const MenuSectionSlot: SlotComponent<
  HTMLDivElement,
  MenuSectionSlotProps
> = withContext<HTMLDivElement, MenuSectionSlotProps>("div", "section");

// Menu Section Label
export const MenuSectionLabelSlot: SlotComponent<
  HTMLDivElement,
  MenuSectionLabelSlotProps
> = withContext<HTMLDivElement, MenuSectionLabelSlotProps>(
  "div",
  "sectionLabel"
);

// Menu Group Label
export const MenuSubmenuSlot: SlotComponent<
  HTMLDivElement,
  MenuSubmenuSlotProps
> = withContext<HTMLDivElement, MenuSubmenuSlotProps>("div", "submenu");
