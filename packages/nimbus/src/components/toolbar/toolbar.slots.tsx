import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { ToolbarRootSlotProps } from "./toolbar.types";

const { withContext } = createRecipeContext({
  key: "nimbusToolbar",
});

/**
 * Slot component that provides the styling context for the Group component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ToolbarRoot = withContext<HTMLDivElement, ToolbarRootSlotProps>(
  "div"
);
