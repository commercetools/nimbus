import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  DraggableListRootSlotProps,
  DraggableListItemSlotProps,
} from "./draggable-list.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDraggableList",
});

// Root slot - provides recipe context + config to all child components
export const DraggableListRootSlot = withProvider<
  HTMLDivElement,
  DraggableListRootSlotProps
>("div", "root");

// Item slot - draggable item displayed in the list
export const DraggableListItemSlot = withContext<
  HTMLDivElement,
  DraggableListItemSlotProps
>("div", "item");

// Item content slot - content displayed in draggable item
export const DraggableListItemContentSlot = withContext<
  HTMLDivElement,
  DraggableListItemSlotProps
>("div", "itemContent");

// Empty list slot - when there are no items in list
export const DraggableListEmptySlot = withContext<
  HTMLDivElement,
  DraggableListItemSlotProps
>("div", "empty");
