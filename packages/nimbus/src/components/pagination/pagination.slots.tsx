import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { paginationRecipe } from "./pagination.recipe";
import type {
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationEllipsisProps,
  PaginationPrevTriggerProps,
  PaginationNextTriggerProps,
} from "./pagination.types";

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: paginationRecipe,
});

export const PaginationRootSlot = withProvider<
  HTMLElement,
  PaginationRootProps
>("nav", "root");

export const PaginationListSlot = withContext<
  HTMLOListElement,
  PaginationListProps
>("ol", "list");

export const PaginationItemSlot = withContext<
  HTMLLIElement,
  PaginationItemProps
>("li", "item");

export const PaginationEllipsisSlot = withContext<
  HTMLSpanElement,
  PaginationEllipsisProps
>("span", "ellipsis");

export const PaginationTriggerSlot = withContext<
  HTMLButtonElement,
  PaginationPrevTriggerProps | PaginationNextTriggerProps
>("button", "trigger");
