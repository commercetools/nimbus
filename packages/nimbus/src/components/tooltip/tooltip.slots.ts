import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { TooltipRootSlotProps } from "./tooltip.types";

const { withContext } = createRecipeContext({ key: "nimbusTooltip" });

/**
 * Root component that provides the styling context for the Tooltip component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TooltipRootSlot: SlotComponent<
  HTMLDivElement,
  TooltipRootSlotProps
> = withContext<HTMLDivElement, TooltipRootSlotProps>("div");
