import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * DraggableList recipe - styling for DraggableList component
 * Supports various sizes, styling for drag and drop elements
 */
export const draggableListSlotRecipe = defineSlotRecipe({
  slots: ["root", "item"],
  className: "nimbus-draggable-list",
  base: { root: {}, item: {} },
  variants: { size: { sm: {}, md: {} } },
});
