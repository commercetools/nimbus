import { useEffect, useCallback, useRef } from "react";
import {
  GridList,
  isTextDropItem,
  useDragAndDrop,
  type Key,
} from "react-aria-components";
import { useListData } from "react-stately";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { dequal } from "dequal";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { draggableListMessagesStrings } from "../draggable-list.messages";
import {
  DraggableListRootSlot,
  DraggableListEmptySlot,
} from "../draggable-list.slots";
import type {
  DraggableListItemData,
  DraggableListRootProps,
} from "../draggable-list.types";
import { DraggableListItem } from "./draggable-list.item";

const DRAGGABLE_LIST_DATA_FORMAT = "nimbus-draggable-list-item";

const defaultGetKey = <T extends DraggableListItemData>(item: T): Key =>
  (item.key as Key) ?? item.id;

/**
 * DraggableList.Root - The root component that provides drag-and-drop functionality
 *
 * Manages the state of draggable items and handles reordering logic using React Aria's
 * GridList and drag-and-drop hooks.
 *
 * @supportsStyleProps
 */
export const DraggableListRoot = <T extends DraggableListItemData>({
  children,
  ref,
  items = [],
  getKey = defaultGetKey,
  onUpdateItems,
  removableItems,
  renderEmptyState: renderEmptyStateFromProps,
  ...restProps
}: DraggableListRootProps<T>) => {
  const msg = useLocalizedStringFormatter(draggableListMessagesStrings);
  const renderEmptyState =
    renderEmptyStateFromProps ?? msg.format("emptyMessage");

  const list = useListData({
    initialItems: items,
    getKey,
  });

  // Track if we're currently syncing from external changes
  const isSyncingFromPropsRef = useRef(false);
  // Track the last items we sent to parent to avoid syncing them back
  const lastNotifiedItemsRef = useRef<T[]>(items ?? []);

  // Sync external items prop changes with internal list state
  useEffect(() => {
    // Performance: Skip sync if shallow equality check passes (same array reference)
    if (items === lastNotifiedItemsRef.current) {
      return;
    }
    // Skip sync if these are the exact items we just sent to parent (deep equality)
    if (dequal(items, lastNotifiedItemsRef.current)) {
      return;
    }
    // If items from props and list.items are not deeply equal,
    // remove all current items from list.items and replace them with items from props
    if (!dequal(items, list.items)) {
      isSyncingFromPropsRef.current = true;

      // Performance Note: Full list replacement (remove all + append all) is O(n) for both
      // operations. For large lists with frequent updates, a diffing algorithm could optimize
      // this to only update changed items. However, for typical use cases, the simplicity and
      // correctness of full replacement outweighs the performance cost.
      const keysToRemove = list.items.map((item) => getKey(item));
      // Remove all current list items
      list.remove(...keysToRemove);
      // Add all items from props
      list.append(...items);

      // Preserve selected keys for items that still exist in the updated items
      if (list.selectedKeys !== "all" && list.selectedKeys.size > 0) {
        const newItemKeys = new Set(items.map((item) => getKey(item)));
        const updatedSelectedKeys = new Set(
          [...list.selectedKeys].filter((key) => newItemKeys.has(key))
        );
        list.setSelectedKeys(updatedSelectedKeys);
      }

      // Update lastNotifiedItemsRef to prevent notification effect from reverting parent state
      lastNotifiedItemsRef.current = items;

      // Timing Note: queueMicrotask schedules the callback after the current synchronous
      // execution completes but before the next event loop tick. This ensures the flag is
      // reset after React processes all state updates from this effect. A cleanup function
      // prevents the microtask from executing if the effect re-runs or component unmounts.
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) {
          isSyncingFromPropsRef.current = false;
        }
      });

      return () => {
        cancelled = true;
      };
    }
    // Dependency Explanation: Only `items` is included as a dependency.
    //
    // Excluded dependencies:
    // - list methods (list.remove, list.append, list.setSelectedKeys) and list.items:
    //   Intentionally excluded to prevent infinite loops. Including these would cause this
    //   effect to run on every internal list update, creating an infinite sync loop.
    //
    // - getKey: Intentionally excluded because it should be stable (either the default
    //   function or a memoized callback). If getKey changes on every render due to not
    //   being memoized, including it would cause unnecessary re-syncs. This effect should
    //   primarily respond to changes in the `items` prop, not the key extraction function.
    //   If getKey does need to change mid-lifecycle, it indicates a parent component bug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Notify parent of internal list changes (but not during external sync)
  useEffect(() => {
    if (!isSyncingFromPropsRef.current) {
      lastNotifiedItemsRef.current = list.items;
      onUpdateItems?.(list.items);
    }
  }, [list.items, onUpdateItems]);

  const { dragAndDropHooks } = useDragAndDrop<T>({
    // Provide item data to drag'n'drop handler
    getItems(_, items) {
      return items.map((item) => ({
        [DRAGGABLE_LIST_DATA_FORMAT]: JSON.stringify(item),
        //TODO: also handle text/plain item type (to allow dropping items into list that are not list items)?
      }));
    },
    // Accept `nimbus-draggable-list-item` drag item type
    acceptedDragTypes: [DRAGGABLE_LIST_DATA_FORMAT],
    // Ensure items are always moved rather than copied
    getDropOperation: () => "move",
    // Handle dropping items from other lists between list items
    async onInsert(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) =>
            JSON.parse(await item.getText(DRAGGABLE_LIST_DATA_FORMAT))
          )
      );
      if (e.target.dropPosition === "before") {
        list.insertBefore(e.target.key, ...processedItems);
      } else if (e.target.dropPosition === "after") {
        list.insertAfter(e.target.key, ...processedItems);
      }
    },
    // Handle drops on list when empty
    async onRootDrop(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) =>
            JSON.parse(await item.getText(DRAGGABLE_LIST_DATA_FORMAT))
          )
      );
      list.append(...processedItems);
    },
    // Handle reordering within list
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },
    // Remove the items from the source list on drop
    // if they were moved to a different list.
    async onDragEnd(e) {
      if (e.dropOperation === "move" && !e.isInternal) {
        list.remove(...e.keys);
      }
    },
  });

  const handleRemoveItem = useCallback(
    (key: Key) => {
      list.remove(key);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list.remove]
  );

  if (
    !children &&
    items?.length > 0 &&
    (!items?.[0]?.key || !items?.[0]?.label)
  ) {
    throw new Error(
      'Nimbus DraggableList: when "children" is not provided, items must have both "key" and "label" properties'
    );
  }

  const recipe = useSlotRecipe({ key: "nimbusDraggableList" });
  // Extract recipe props
  const [recipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restProps);
  return (
    <DraggableListRootSlot {...styleProps} {...recipeProps} asChild>
      <GridList
        ref={ref}
        {...functionalProps}
        renderEmptyState={() => (
          <DraggableListEmptySlot>{renderEmptyState}</DraggableListEmptySlot>
        )}
        dragAndDropHooks={dragAndDropHooks}
        items={list.items}
        dependencies={[handleRemoveItem]}
      >
        {(item) => {
          return children ? (
            typeof children === "function" ? (
              children({
                ...item,
                onRemoveItem: removableItems ? handleRemoveItem : undefined,
              })
            ) : (
              children
            )
          ) : (
            <DraggableListItem
              {...item}
              key={item.key}
              onRemoveItem={removableItems ? handleRemoveItem : undefined}
            >
              {item.label}
            </DraggableListItem>
          );
        }}
      </GridList>
    </DraggableListRootSlot>
  );
};

DraggableListRoot.displayName = "DraggableList.Root";
