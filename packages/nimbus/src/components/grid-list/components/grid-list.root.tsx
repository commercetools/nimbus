import { useMemo } from "react";
import { GridList as RaGridList } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { SimpleGrid } from "@/components/simple-grid/simple-grid";
import { GridListRootSlot, GridListEmptyStateSlot } from "../grid-list.slots";
import { gridListMessagesStrings } from "../grid-list.messages";
import type { GridListRootProps } from "../grid-list.types";
import { GridListProvider } from "./grid-list.context";

/**
 * GridList.Root - The collection container.
 *
 * Wraps React Aria's `GridList` and renders its element through `SimpleGrid`,
 * so `columns`, `minChildWidth` and `gap` accept responsive objects. With
 * `layout="stack"` (the default) it uses one column. Shares the `size` and the
 * built-in control defaults with its items.
 *
 * @supportsStyleProps
 */
export const GridListRoot = <T extends object>(props: GridListRootProps<T>) => {
  const {
    ref,
    size = "md",
    layout,
    columns,
    minChildWidth,
    gap,
    showSelectionCheckbox = false,
    showDragHandle = false,
    renderEmptyState,
    ...restProps
  } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);
  const msg = useLocalizedStringFormatter(gridListMessagesStrings);

  const renderEmpty =
    renderEmptyState ??
    (() => (
      <GridListEmptyStateSlot>
        {msg.format("emptyMessage")}
      </GridListEmptyStateSlot>
    ));

  const contextValue = useMemo(
    () => ({ size, showSelectionCheckbox, showDragHandle }),
    [size, showSelectionCheckbox, showDragHandle]
  );

  // A stack is one column: the column props only apply to the grid layout.
  const isGrid = layout === "grid";

  return (
    <GridListProvider value={contextValue}>
      <GridListRootSlot asChild ref={ref} size={size} {...styleProps}>
        <RaGridList
          {...functionalProps}
          layout={layout}
          renderEmptyState={renderEmpty}
          render={(domProps) => (
            <SimpleGrid
              {...domProps}
              columns={isGrid ? columns : 1}
              minChildWidth={isGrid ? minChildWidth : undefined}
              gap={gap}
            />
          )}
        />
      </GridListRootSlot>
    </GridListProvider>
  );
};

GridListRoot.displayName = "GridList.Root";
