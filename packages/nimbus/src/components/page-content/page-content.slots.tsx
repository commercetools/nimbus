import { createSlotRecipeContext } from "@chakra-ui/react";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  PageContentColumnSlotProps,
  PageContentRootSlotProps,
} from "./page-content.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusPageContent",
});

/**
 * Root component that provides the styling context for the PageContent component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const PageContentRootSlot: SlotComponent<
  HTMLDivElement,
  PageContentRootSlotProps
> = withProvider<HTMLDivElement, PageContentRootSlotProps>("div", "root");

export const PageContentColumnSlot: SlotComponent<
  HTMLDivElement,
  PageContentColumnSlotProps
> = withContext<HTMLDivElement, PageContentColumnSlotProps>("div", "column");
