import { createRecipeContext } from "@chakra-ui/react";

import type { TooltipRootSlotProps } from "./tooltip.types";

const { withContext } = createRecipeContext({ key: "tooltip" });

/**
 * Root component that provides the styling context for the Tooltip component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TooltipRootSlot = withContext<
  HTMLDivElement,
  TooltipRootSlotProps
>("div");
