import type { ReactNode, RefObject } from "react";
import type {
  HTMLChakraProps,
  RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import type {
  GridListProps,
  GridListItemProps,
  Key,
} from "react-aria-components";
import { draggableListSlotRecipe } from "./draggable-list.recipe";
import type { DraggableListItemSlotProps } from "./draggable-list.slots";

/**
 * Base data shape for draggable list items
 *
 * `key` and `label` values are defined for use with legacy UI Kit column manager drag and drop
 *
 * If either`key` or `label` are not defined, you must handle the `Children` of the DraggableListRoot yourself
 */
export type DraggableListItemData = {
  key?: string;
  label?: ReactNode;
} & Record<string, unknown>;

/**
 * Props for the DraggableList.Root component
 *
 * The root component provides styling context and drag-and-drop state management
 *
 * @param T Type for item data displayed in the list, i.e. the `items` prop's type is `T[]`
 */
export interface DraggableListRootProps<T extends DraggableListItemData>
  extends Omit<
      GridListProps<T>,
      "autoFocus" | "className" | "style" | "translate" | "renderEmptyState"
    >,
    Omit<
      HTMLChakraProps<
        "div",
        RecipeVariantProps<typeof draggableListSlotRecipe>
      >,
      "children" | "slot"
    > {
  /** If `children` is not declared, each item must have both a `key` and a `label` value */
  items?: T[];
  /** Callback that is called any time the list is updated by any drag and drop event or removal of an item */
  onUpdateItems?: (updatedItems: T[]) => void;
  ref?: RefObject<HTMLDivElement>;
  /**
   * Controls whether a 'remove' button is displayed in each item
   * if an item is removed, the updated list is returned by the `onUpdateItems` function
   */
  removableItems?: boolean;
  /** If `children` is not declared, each item must have both a `key` and a `label` value */
  children?: GridListProps<T>["children"];
  /**
   *  Renders when list is empty
   *  @default "drop items here"
   */
  renderEmptyState?: ReactNode;
}

/**
 * Props for the DraggableList.Item component
 *
 * The item component renders each item in the list
 *
 * @param T Type for item's data object
 */
export interface DraggableListItemProps<T extends DraggableListItemData>
  extends Omit<
      GridListItemProps<T>,
      "className" | "onClick" | "style" | "translate"
    >,
    Omit<DraggableListItemSlotProps, "children"> {
  id?: string;
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  /**
   * Optional callback invoked when remove button is pressed
   * Remove button is only rendered if this callback is declared
   */
  onRemoveItem?: (key: Key) => void;
}
