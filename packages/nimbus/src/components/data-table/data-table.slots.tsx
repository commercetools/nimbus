import {
  type HTMLChakraProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";
import type {
  DataTableBodySlotProps,
  DataTableCellSlotProps,
  DataTableColumnSlotProps,
  DataTableHeaderSlotProps,
  DataTableRootSlotProps,
  DataTableRowSlotProps,
  DataTableTableSlotProps,
} from "./data-table.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDataTable",
});

/**
 * Root component that provides the styling context for the DataTable component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
// Wrapper slot for react aria `ResizableTableContainer` component
export const DataTableRoot = withProvider<
  HTMLDivElement,
  DataTableRootSlotProps
>("div", "root");

export const DataTableTableSlot = withContext<
  HTMLTableElement,
  DataTableTableSlotProps
>("table", "table");

// Wrapper slot for the react aria `TableHeader` component
export const DataTableHeaderSlot = withContext<
  HTMLTableSectionElement,
  DataTableHeaderSlotProps
>("tr", "header");

// Wrapper slot for react aria `Column` component
export const DataTableColumnSlot = withContext<
  HTMLTableCellElement,
  DataTableColumnSlotProps
>("th", "column");

// Wrapper for the react aria `TableBody` component
export const DataTableBodySlot = withContext<
  HTMLTableSectionElement,
  DataTableBodySlotProps
>("tbody", "body");

// Wrapper for the react aria `Row` component
export const DataTableRowSlot = withContext<
  HTMLTableRowElement,
  DataTableRowSlotProps
>("tr", "row");

// Wrapper for the react aria `Cell` component
export const DataTableCellSlot = withContext<
  HTMLTableCellElement,
  DataTableCellSlotProps
>("td", "cell");

export const DataTableFooter = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("footer", "footer");

export const DataTableSelectionCell = withContext<
  HTMLTableCellElement,
  HTMLChakraProps<"td">
>("td", "selectionCell");

export const DataTableNestedIcon = withContext<
  HTMLSpanElement,
  HTMLChakraProps<"span">
>("span", "nestedIcon");

export const DataTableHeaderSortIcon = withContext<
  HTMLSpanElement,
  HTMLChakraProps<"span">
>("span", "headerSortIcon");

export const DataTableColumnResizer = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "columnResizer");
