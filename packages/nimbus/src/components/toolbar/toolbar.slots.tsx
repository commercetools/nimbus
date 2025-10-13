import { createRecipeContext } from "@chakra-ui/react";
import type { ToolbarSlotProps } from "./toolbar.types";

const { withContext } = createRecipeContext({
  key: "toolbar",
});

/**
 * Slot component that provides the styling context for the Group component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ToolbarRoot = withContext<HTMLDivElement, ToolbarSlotProps>("div");
