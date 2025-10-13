import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { IconRootSlotProps } from "./icon.types";

const { withContext } = createRecipeContext({ key: "icon" });

/**
 * Root component that provides the styling context for the Icon component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const IconRootSlot = withContext<SVGSVGElement, IconRootSlotProps>(
  "svg"
);
