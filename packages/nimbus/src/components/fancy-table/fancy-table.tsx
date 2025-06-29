import React from "react";
import {
  Table,
  ResizableTableContainer,
  useDragAndDrop,
  isTextDropItem,
} from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import {
  FancyTableRootSlot,
  FancyTableContainerSlot,
} from "./fancy-table.slots";
import {
  FancyTableHeader,
  FancyTableBody,
  FancyTableColumn,
} from "./components";
import { fancyTableSlotRecipe } from "./fancy-table.recipe";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type {
  FancyTableComponentProps,
  FancyTableItem,
} from "./fancy-table.types";

export const FancyTable = <T extends FancyTableItem = FancyTableItem>({
  items = [],
  columns = [],
  renderCell,
  renderEmptyState,
  allowsDragging = false,
  allowsResizing = false,
  renderDragPreview,
  onReorder,
  onItemsMove,
  children,
  ...props
}: FancyTableComponentProps<T>) => {
  const recipe = useSlotRecipe({ recipe: fancyTableSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  // Default cell renderer
  const defaultRenderCell = React.useCallback(
    (item: T, column: (typeof columns)[0]) => {
      return item[column.id] || "";
    },
    []
  );

  // Drag and drop hooks
  const dragAndDropHooks = allowsDragging
    ? useDragAndDrop({
        getItems: (keys) =>
          [...keys].map((key) => {
            const item = items.find((item) => item.id === key);
            return {
              "application/json": JSON.stringify(item),
              "text/plain": item ? String(item.id) : "",
            };
          }),
        onReorder: (e) => {
          if (onReorder && e.target.dropPosition) {
            onReorder([...e.keys], {
              key: e.target.key,
              dropPosition: e.target.dropPosition,
            });
          }
        },
        onInsert: async (e) => {
          if (onReorder && e.target.dropPosition) {
            const processedItems = await Promise.all(
              e.items
                .filter(isTextDropItem)
                .map(async (item) =>
                  JSON.parse(await item.getText("application/json"))
                )
            );
            // Handle insertion of items from external sources
            console.log("Insert items:", processedItems);
          }
        },
        onDragEnd: (e) => {
          if (e.dropOperation === "move" && !e.isInternal && onItemsMove) {
            onItemsMove([...e.keys]);
          }
        },
        renderDragPreview: renderDragPreview
          ? (items) => {
              const itemsData = [...items.keys()].map((key) =>
                items.find((item) => item.id === key)
              );
              return renderDragPreview(itemsData.filter(Boolean) as T[]);
            }
          : undefined,
      })
    : undefined;

  const tableContent = (
    <FancyTableRootSlot
      asChild
      selectionMode={props.selectionMode}
      allowsDragging={allowsDragging}
      dragAndDropHooks={dragAndDropHooks}
      {...recipeProps}
      {...styleProps}
    >
      <Table {...restProps}>
        {children ? (
          children
        ) : (
          <>
            <FancyTableHeader columns={columns}>
              {(column) => (
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
              items={items}
              columns={columns}
              renderCell={renderCell || defaultRenderCell}
              renderEmptyState={renderEmptyState}
            />
          </>
        )}
      </Table>
    </FancyTableRootSlot>
  );

  // Wrap in ResizableTableContainer if resizing is enabled
  if (allowsResizing) {
    return <FancyTableContainerSlot>{tableContent}</FancyTableContainerSlot>;
  }

  return tableContent;
};

FancyTable.displayName = "FancyTable";
