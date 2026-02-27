import { createRecipeContext } from "@chakra-ui/react/styled-system";
import { Group as RaGroup } from "react-aria-components";
import type { SlotComponent } from "@/type-utils";
import type { GroupRootSlotProps } from "./group.types";

const { withContext } = createRecipeContext({
  key: "nimbusGroup",
});

/**
 * Slot component that provides the styling context for the Group component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const GroupSlot: SlotComponent<typeof RaGroup, GroupRootSlotProps> =
  withContext<typeof RaGroup, GroupRootSlotProps>(RaGroup);
