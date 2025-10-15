import { createRecipeContext } from "@chakra-ui/react";

import type { TooltipRootSlotProps } from "./tooltip.types";
import type { SlotComponent } from "../utils/slot-types";

const { withContext } = createRecipeContext({ key: "tooltip" });

/**
 * Root component that provides the styling context for the Tooltip component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TooltipRootSlot: SlotComponent<
  HTMLDivElement,
  TooltipRootSlotProps
> = withContext<HTMLDivElement, TooltipRootSlotProps>("div");
