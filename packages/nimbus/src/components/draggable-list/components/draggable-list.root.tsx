import { useEffect, useCallback, useRef } from "react";
import { useIntl } from "react-intl";
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
import { messages } from "../draggable-list.i18n";
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

export const DraggableListRoot = <T extends DraggableListItemData>({
  children,
  ref,
  items = [],
  getKey = (item) => (item.key as Key) ?? item.id,
  onUpdateItems,
  removableItems,
  renderEmptyState: renderEmptyStateFromProps,
  ...restProps
}: DraggableListRootProps<T>) => {
  const { formatMessage } = useIntl();
  const renderEmptyState =
    renderEmptyStateFromProps ?? formatMessage(messages.emptyMessage);

  const list = useListData({
    initialItems: items,
    getKey,
  });

  // Track if we're currently syncing from external changes
  const isSyncingFromPropsRef = useRef(false);
  // Track the last items we sent to parent to avoid syncing them back
  const lastNotifiedItemsRef = useRef<T[]>(items);

  // Sync external items prop changes with internal list state
  useEffect(() => {
    // Skip sync if these are the exact items we just sent to parent
    if (dequal(items, lastNotifiedItemsRef.current)) {
      return;
    }
    // If items from props and list.items are not deeply equal,
    // remove all current items from list.items and replace them with items from props
    if (!dequal(items, list.items)) {
      isSyncingFromPropsRef.current = true;

      list.setSelectedKeys(new Set());
      const keysToRemove = list.items.map((item) => getKey(item));
      list.remove(...keysToRemove);
      list.append(...items);

      // Update lastNotifiedItemsRef to prevent notification effect from reverting parent state
      lastNotifiedItemsRef.current = items;

      // Reset flag after React finishes updates
      queueMicrotask(() => {
        isSyncingFromPropsRef.current = false;
      });
    }
  }, [items, getKey]);

  // Notify parent of internal list changes (but not during external sync)
  useEffect(() => {
    if (!isSyncingFromPropsRef.current) {
      lastNotifiedItemsRef.current = list.items;
      onUpdateItems?.(list.items);
    }
  }, [list.items, onUpdateItems, getKey]);

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

  const recipe = useSlotRecipe({ key: "draggableList" });
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
