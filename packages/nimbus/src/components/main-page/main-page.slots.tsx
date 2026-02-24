import { createSlotRecipeContext } from "@chakra-ui/react";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  MainPageRootSlotProps,
  MainPageHeaderSlotProps,
  MainPageTitleSlotProps,
  MainPageActionsSlotProps,
  MainPageContentSlotProps,
  MainPageFooterSlotProps,
} from "./main-page.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusMainPage",
});

/**
 * Root component that provides the styling context for the MainPage component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const MainPageRootSlot: SlotComponent<
  HTMLDivElement,
  MainPageRootSlotProps
> = withProvider<HTMLDivElement, MainPageRootSlotProps>("div", "root");

export const MainPageHeaderSlot: SlotComponent<
  HTMLElement,
  MainPageHeaderSlotProps
> = withContext<HTMLElement, MainPageHeaderSlotProps>("header", "header");

export const MainPageTitleSlot: SlotComponent<
  HTMLHeadingElement,
  MainPageTitleSlotProps
> = withContext<HTMLHeadingElement, MainPageTitleSlotProps>("h1", "title");

export const MainPageActionsSlot: SlotComponent<
  HTMLDivElement,
  MainPageActionsSlotProps
> = withContext<HTMLDivElement, MainPageActionsSlotProps>("div", "actions");

export const MainPageContentSlot: SlotComponent<
  HTMLElement,
  MainPageContentSlotProps
> = withContext<HTMLElement, MainPageContentSlotProps>("main", "content");

export const MainPageFooterSlot: SlotComponent<
  HTMLElement,
  MainPageFooterSlotProps
> = withContext<HTMLElement, MainPageFooterSlotProps>("footer", "footer");
