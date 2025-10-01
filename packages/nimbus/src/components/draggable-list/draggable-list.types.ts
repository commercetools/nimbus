import type { ReactNode, RefObject } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import type { GridListProps, GridListItemProps } from "react-aria-components";
import { draggableListSlotRecipe } from "./draggable-list.recipe";
import type { DraggableListItemSlotProps } from "./draggable-list.slots";

/**
 * Props for the DraggableList.Root component
 *
 * The root component provides styling context and drag-and-drop state management
 *
 * @param T Type for item data displayed in the list, i.e. the `items` prop's type is `T[]`
 */
export interface DraggableListRootProps<T extends object>
  extends GridListProps<T>,
    RecipeVariantProps<typeof draggableListSlotRecipe> {
  items?: T[];
  ref?: RefObject<HTMLDivElement>;
}

/**
 * Props for the DraggableList.Item component
 *
 * The item component renders each item in the list
 *
 * @param T Type for item's data object
 */
export interface DraggableListItemProps<T extends object>
  extends Omit<
      GridListItemProps<T>,
      "className" | "onClick" | "style" | "translate"
    >,
    Omit<DraggableListItemSlotProps, "children"> {
  id?: string;
  ref?: RefObject<HTMLDivElement>;
  children: ReactNode;
}
