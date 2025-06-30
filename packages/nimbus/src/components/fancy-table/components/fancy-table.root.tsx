import React from "react";
import {
  Table,
  ResizableTableContainer,
  useDragAndDrop,
  isTextDropItem,
  type SortDescriptor,
  type DragAndDropHooks,
} from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import { useListData } from "react-stately";
import { FancyTableRootSlot } from "../fancy-table.slots";
import { FancyTableHeader, FancyTableBody, FancyTableColumn } from "./";
import { fancyTableSlotRecipe } from "../fancy-table.recipe";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type {
  FancyTableComponentProps,
  FancyTableItem,
} from "../fancy-table.types";

export const FancyTableRoot = <T extends FancyTableItem = FancyTableItem>({
  items: originalItems = [],
  columns = [],
  renderCell,
  renderEmptyState,
  allowsDragging = false,
  allowsResizing = false,
  renderDragPreview,
  onReorder,
  onItemsMove,
  onSortChange,
  sortDescriptor: controlledSortDescriptor,
  children,
  ...props
}: FancyTableComponentProps<T>) => {
  const recipe = useSlotRecipe({ recipe: fancyTableSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  const list = useListData({
    initialItems: originalItems,
  });

  const [sortDescriptor, setSortDescriptor] = React.useState(
    controlledSortDescriptor
  );

  const sortedItems = React.useMemo(() => {
    if (!sortDescriptor) {
      return list.items;
    }
    const sorted = [...list.items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T] as any;
      const second = b[sortDescriptor.column as keyof T] as any;
      let cmp =
        (first < second ? -1 : 1) *
        (sortDescriptor.direction === "descending" ? -1 : 1);
      return cmp;
    });
    return sorted;
  }, [sortDescriptor, list.items]);

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    if (onSortChange) {
      onSortChange(descriptor);
    }
  };

  const { dragAndDropHooks } = useDragAndDrop(
    allowsDragging
      ? {
          getItems: (keys) =>
            [...keys].map((key) => {
              const item = list.getItem(key);
              return {
                "application/json": JSON.stringify(item),
                "text/plain": item ? String(item.id) : "",
              };
            }),
          onReorder: (e) => {
            if (e.target.dropPosition === "before") {
              list.moveBefore(e.target.key, e.keys);
            } else if (e.target.dropPosition === "after") {
              list.moveAfter(e.target.key, e.keys);
            }
          },
          onInsert: async (e) => {
            const processedItems = await Promise.all(
              e.items
                .filter(isTextDropItem)
                .map(async (item) =>
                  JSON.parse(await item.getText("application/json"))
                )
            );

            if (e.target.dropPosition === "before") {
              list.insertBefore(e.target.key, ...processedItems);
            } else if (e.target.dropPosition === "after") {
              list.insertAfter(e.target.key, ...processedItems);
            }
          },
          onRootDrop: async (e) => {
            const processedItems = await Promise.all(
              e.items
                .filter(isTextDropItem)
                .map(async (item) =>
                  JSON.parse(await item.getText("application/json"))
                )
            );
            list.append(...processedItems);
          },
          onDragEnd: (e) => {
            if (e.dropOperation === "move" && !e.isInternal && onItemsMove) {
              onItemsMove([...e.keys]);
            }
          },
          renderDragPreview: renderDragPreview
            ? (items) => {
                const itemsData = [...items.keys()].map((key) =>
                  list.getItem(key)
                );
                return renderDragPreview(
                  itemsData.filter(Boolean) as T[]
                ) as React.ReactElement;
              }
            : undefined,
        }
      : {}
  );

  // Default cell renderer
  const defaultRenderCell = React.useCallback(
    (item: T, column: (typeof columns)[0]) => {
      return item[column.id] || "";
    },
    []
  );

  const tableContent = (
    <FancyTableRootSlot asChild {...recipeProps} {...styleProps}>
      <Table
        {...restProps}
        selectionMode={props.selectionMode}
        dragAndDropHooks={dragAndDropHooks}
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
      >
        {children ? (
          children
        ) : (
          <>
            <FancyTableHeader columns={columns}>
              {(column: (typeof columns)[0]) => (
                <FancyTableColumn
                  key={column.id}
                  id={column.id}
                  isRowHeader={column.isRowHeader}
                  allowsSorting={column.allowsSorting}
                  allowsResizing={allowsResizing}
                  width={column.width}
                  minWidth={column.minWidth}
                  maxWidth={column.maxWidth}
                >
                  {column.name}
                </FancyTableColumn>
              )}
            </FancyTableHeader>
            <FancyTableBody
              items={sortedItems}
              columns={columns}
              renderCell={renderCell || (defaultRenderCell as any)}
              renderEmptyState={renderEmptyState}
            />
          </>
        )}
      </Table>
    </FancyTableRootSlot>
  );

  // Wrap in ResizableTableContainer if resizing is enabled
  if (allowsResizing) {
    return <ResizableTableContainer>{tableContent}</ResizableTableContainer>;
  }

  return tableContent;
};

FancyTableRoot.displayName = "FancyTableRoot";
