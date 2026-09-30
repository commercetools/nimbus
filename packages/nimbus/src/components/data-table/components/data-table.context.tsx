import { createContext, useContext, useMemo } from "react";
import type {
  DataTableContextValue,
  DataTableRowItem,
  SortDescriptor,
  CustomSettingsContextValue,
  TableSelectionContextValue,
} from "../data-table.types";

type InteractionContextValue<T extends object = Record<string, unknown>> = {
  sortedRows: DataTableRowItem<T>[];
  filteredRows: DataTableRowItem<T>[];
  sortDescriptor?: SortDescriptor;
  expanded: Set<string>;
  pinnedRows: Set<string>;
  pinnedRowIds: string[];
};

/**
 * The configuration `DataTable.Row` reads. It leaves out `columns` and `rows`:
 * a row renders `activeColumns`, and its own data arrives as the `row` prop.
 * So a new `rows` array, or a change to one row, re-renders only the rows
 * whose `row` object changed, not every row.
 */
type DataTableRowContextValue<T extends object = Record<string, unknown>> =
  Pick<
    DataTableContextValue<T>,
    | "activeColumns"
    | "search"
    | "toggleExpand"
    | "nestedKey"
    | "disabledKeys"
    | "showExpandColumn"
    | "hasExpandableContent"
    | "showSelectionColumn"
    | "showPinColumn"
    | "isTruncated"
    | "isRowClickable"
    | "hasRenderNestedContent"
    | "onRowClickRef"
    | "onRowActionRef"
    | "renderNestedContent"
    | "togglePin"
    | "selectRowLabel"
    | "getRowKey"
  >;

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);
DataTableContext.displayName = "DataTable.Context";

export const DataTableRowContext = createContext<DataTableRowContextValue<
  Record<string, unknown>
> | null>(null);
DataTableRowContext.displayName = "DataTable.RowContext";

export const InteractionContext = createContext<InteractionContextValue<
  Record<string, unknown>
> | null>(null);
InteractionContext.displayName = "DataTable.InteractionContext";

export const TableSelectionContext =
  createContext<TableSelectionContextValue | null>(null);
TableSelectionContext.displayName = "DataTable.SelectionContext";

export const CustomSettingsContext =
  createContext<CustomSettingsContextValue | null>(null);
CustomSettingsContext.displayName = "CustomSettings.Context";

/**
 * Everything the table knows: its configuration, the interaction state
 * (sorted rows, expansion, pinning) and the selection, in one object.
 *
 * A component that calls it re-renders on every row interaction, such as
 * expanding or pinning a row. DataTable's own components therefore read only
 * the context they need: `useStableDataTableContext`,
 * `useDataTableRowContext` or `useInteractionContext`. This hook is kept for
 * consumers, as `DataTable.useDataTableContext`.
 */
export const useDataTableContext = <
  T extends object = Record<string, unknown>,
>(): DataTableContextValue<T> => {
  const context = useContext(
    DataTableContext
  ) as DataTableContextValue<T> | null;
  const interactionData = useContext(
    InteractionContext
  ) as InteractionContextValue<T> | null;
  const selection = useContext(TableSelectionContext);
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return useMemo(
    () => ({ ...context, ...interactionData, ...selection }),
    [context, interactionData, selection]
  ) as DataTableContextValue<T>;
};

/**
 * The table configuration without the interaction state, so expanding,
 * pinning, sorting or selecting a row does not re-render the caller. The value
 * changes when a prop of `DataTable.Root` changes.
 */
export const useStableDataTableContext = <
  T extends object = Record<string, unknown>,
>() => {
  const context = useContext(
    DataTableContext
  ) as DataTableContextValue<T> | null;
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return context;
};

/**
 * The configuration a row reads. Unlike `useStableDataTableContext`, it does
 * not change when `rows` or `columns` get a new array; see
 * `DataTableRowContextValue`.
 */
export const useDataTableRowContext = <
  T extends object = Record<string, unknown>,
>() => {
  const context = useContext(
    DataTableRowContext
  ) as DataTableRowContextValue<T> | null;
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return context;
};

/**
 * The interaction state: sorted and filtered rows, the sort descriptor, and
 * the expanded and pinned rows. It changes on every row interaction.
 */
export const useInteractionContext = <
  T extends object = Record<string, unknown>,
>(): InteractionContextValue<T> => {
  const context = useContext(
    InteractionContext
  ) as InteractionContextValue<T> | null;
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return context;
};

export const useTableSelectionContext = (): TableSelectionContextValue => {
  const context = useContext(TableSelectionContext);
  if (!context) {
    throw new Error(
      "DataTable selection components must be used within DataTable.Root"
    );
  }
  return context;
};

export const useCustomSettingsContext = () => {
  const context = useContext(CustomSettingsContext);
  if (!context) {
    throw new Error(
      "CustomSettings components must be used within CustomSettings.Root"
    );
  }
  return context;
};
