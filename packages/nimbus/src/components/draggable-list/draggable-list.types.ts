import type { ReactNode, Ref } from "react";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react/styled-system";
import type { FormFieldProps } from "@/components";
import type {
  GridListProps as RaGridListProps,
  GridListItemProps as RaGridListItemProps,
  Key,
} from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type DraggableListRecipeProps = {
  /**
   * Size variant of the draggable list
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusDraggableList">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type DraggableListRootSlotProps = HTMLChakraProps<
  "div",
  DraggableListRecipeProps
>;

export type DraggableListItemSlotProps = HTMLChakraProps<"div">;

export type DraggableListItemContentSlotProps = HTMLChakraProps<"div">;

export type DraggableListEmptySlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

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
 * Data shape for items used in DraggableList.Field
 *
 * Extends DraggableListItemData with required key and label properties.
 * This ensures all items have the necessary data for default rendering in form fields.
 *
 * @property key - Unique identifier for the item (required)
 * @property label - Display content for the item (required)
 */
export type DraggableListFieldItemData = DraggableListItemData & {
  key: string;
  label: string;
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the DraggableList.Root component
 *
 * The root component that provides context and state management for the draggable list.
 * Uses React Aria's GridList for accessibility and drag-and-drop functionality.
 *
 * @template T - Type for item data displayed in the list. Items array type is `T[]`.
 */
export type DraggableListRootProps<T extends DraggableListItemData> = Omit<
  RaGridListProps<T>,
  "autoFocus" | "className" | "style" | "translate" | "renderEmptyState"
> &
  Omit<
    HTMLChakraProps<"div", SlotRecipeProps<"nimbusDraggableList">>,
    "children" | "slot"
  > & {
    /**
     * Array of items to display in the list.
     * If `children` is not provided, each item must have both `key` and `label` properties.
     */
    items?: T[];
    /**
     * Function to extract a unique key from each item when items do not have a `key` or `id` field.
     * Defaults to using `item.key` or `item.id`.
     *
     * **Important:** Wrap this function in `useCallback` to prevent unnecessary re-synchronization
     * of the list state. If this function's identity changes on every render, it will trigger
     * the internal sync effect, potentially causing performance issues.
     *
     * @param item - The item to extract the key from
     * @returns The unique key for the item
     * @default useCallback((item) => (item.key ?? item.id), [])
     * @example
     * ```tsx
     * // ✅ Good: Memoized with useCallback
     * const getKey = useCallback((item) => item.name, []);
     * <DraggableList.Root items={items} getKey={getKey} />
     *
     * // ❌ Bad: Inline function creates new identity on every render
     * <DraggableList.Root items={items} getKey={(item) => item.name} />
     * ```
     */
    getKey?: (item: T) => Key;
    /**
     * Callback fired when the list is updated by drag-and-drop or item removal
     * @param updatedItems - The new array of items after the update
     */
    onUpdateItems?: (updatedItems: T[]) => void;
    /**
     * Ref to the root container element
     */
    ref?: Ref<HTMLDivElement>;
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
    children?: RaGridListProps<T>["children"];
    /**
     * Content to display when the list is empty
     * @default "drop items here"
     */
    renderEmptyState?: ReactNode;
  };

/**
 * Props for the DraggableList.Item component
 *
 * The item component renders each individual item in the draggable list.
 * Supports drag-and-drop interaction and optional removal.
 *
 * @template T - Type for the item's data object
 */
export type DraggableListItemProps<T extends DraggableListItemData> = Omit<
  RaGridListItemProps<T>,
  "className" | "onClick" | "style" | "translate"
> &
  Omit<DraggableListItemSlotProps, "children"> & {
    /**
     * The unique identifier for the item
     */
    id?: string;
    /**
     * Ref to the item container element
     */
    ref?: Ref<HTMLDivElement>;
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
  };

/**
 * Props for the DraggableList.Field component
 *
 * A form field wrapper for DraggableList that combines the draggable list
 * functionality with form field labeling, description, and error handling.
 *
 * This component is configured via props only and does not accept children.
 * Items are rendered using their `key` and `label` properties.
 *
 * @template T - Type for item data, must extend DraggableListFieldItemData
 */
export type DraggableListFieldProps<T extends DraggableListFieldItemData> =
  Omit<DraggableListRootProps<T>, "children" | "direction"> &
    Omit<FormFieldProps, "slot"> & {
      /**
       * The form field label (required)
       *
       * If a visible label is not necessary, use `DraggableList.Root`
       */
      label: ReactNode;
      /**
       * Optional description text displayed below the label
       */
      description?: ReactNode;
      /**
       * Error message to display when validation fails
       */
      error?: ReactNode;
      /**
       * Optional info box content for additional context
       */
      infoBox?: ReactNode;
    };
