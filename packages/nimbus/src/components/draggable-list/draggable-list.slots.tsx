import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { draggableListSlotRecipe } from "./draggable-list.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: draggableListSlotRecipe,
});

// Root slot - provides recipe context + config to all child components
export type DraggableListRootSlotProps = HTMLChakraProps<"div">;
export const DraggableListRootSlot = withProvider<
  HTMLDivElement,
  DraggableListRootSlotProps
>("div", "root");

// Item slot - draggable item displayed in the list
export type DraggableListItemSlotProps = HTMLChakraProps<"div">;
export const DraggableListItemSlot = withContext<
  HTMLDivElement,
  DraggableListItemSlotProps
>("div", "item");

// Item content slot - content displayed in draggable item
export type DraggableListItemContentSlotProps = HTMLChakraProps<"div">;
export const DraggableListItemContentSlot = withContext<
  HTMLDivElement,
  DraggableListItemSlotProps
>("div", "itemContent");

// Empty list slot - when there are no items in list
export type DraggableListEmptySlotProps = HTMLChakraProps<"div">;
export const DraggableListEmptySlot = withContext<
  HTMLDivElement,
  DraggableListItemSlotProps
>("div", "empty");
