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
 * @property key - Unique identifier for the item (required for default rendering)
 * @property label - Display content for the item (required for default rendering)
 *
 * If either `key` or `label` are not defined, you must provide custom children
 * to the DraggableList.Root component.
 */
export type DraggableListItemData = {
  key?: string;
  label?: ReactNode;
} & Record<string, unknown>;

/**
 * Props for the DraggableList.Root component
 *
 * The root component that provides context and state management for the draggable list.
 * Uses React Aria's GridList for accessibility and drag-and-drop functionality.
 *
 * @template T - Type for item data displayed in the list. Items array type is `T[]`.
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
  /**
   * Array of items to display in the list.
   * If `children` is not provided, each item must have both `key` and `label` properties.
   */
  items?: T[];
  /**
   * Callback fired when the list is updated by drag-and-drop or item removal
   * @param updatedItems - The new array of items after the update
   */
  onUpdateItems?: (updatedItems: T[]) => void;
  /**
   * Ref to the root container element
   */
  ref?: RefObject<HTMLDivElement>;
  /**
   * Whether to show a remove button for each item.
   * When an item is removed, `onUpdateItems` is called with the updated list.
   * @default false
   */
  removableItems?: boolean;
  /**
   * Custom render function for list items.
   * If not provided, items will be rendered using their `key` and `label` properties.
   */
  children?: GridListProps<T>["children"];
  /**
   * Content to display when the list is empty
   * @default "drop items here"
   */
  renderEmptyState?: ReactNode;
}

/**
 * Props for the DraggableList.Item component
 *
 * The item component renders each individual item in the draggable list.
 * Supports drag-and-drop interaction and optional removal.
 *
 * @template T - Type for the item's data object
 */
export interface DraggableListItemProps<T extends DraggableListItemData>
  extends Omit<
      GridListItemProps<T>,
      "className" | "onClick" | "style" | "translate"
    >,
    Omit<DraggableListItemSlotProps, "children"> {
  /**
   * The unique identifier for the item
   */
  id?: string;
  /**
   * Ref to the item container element
   */
  ref?: RefObject<HTMLDivElement>;
  /**
   * The content to display for this item
   */
  children?: ReactNode;
  /**
   * Callback fired when the remove button is pressed.
   * The remove button is only rendered when this callback is provided.
   * @param key - The key of the item being removed
   */
  onRemoveItem?: (key: Key) => void;
}
