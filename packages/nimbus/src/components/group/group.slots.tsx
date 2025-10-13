import { createRecipeContext } from "@chakra-ui/react";
import { Group as RaGroup } from "react-aria-components";
import type { GroupSlotProps } from "./group.types";

const { withContext } = createRecipeContext({
  key: "group",
});

/**
 * Slot component that provides the styling context for the Group component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const GroupSlot = withContext<typeof RaGroup, GroupSlotProps>(RaGroup);
