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
