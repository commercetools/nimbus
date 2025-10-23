import { createRecipeContext } from "@chakra-ui/react";
import type { SlotComponent } from "@/type-utils";
import type { IconRootSlotProps } from "./icon.types";

const { withContext } = createRecipeContext({ key: "icon" });

/**
 * Root component that provides the styling context for the Icon component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const IconRootSlot: SlotComponent<SVGSVGElement, IconRootSlotProps> =
  withContext<SVGSVGElement, IconRootSlotProps>("svg");
