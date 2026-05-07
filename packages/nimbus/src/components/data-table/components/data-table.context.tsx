import { createContext, useContext, useMemo } from "react";
import type {
  DataTableContextValue,
  DataTableRowItem,
  CustomSettingsContextValue,
  TableSelectionContextValue,
} from "../data-table.types";

type RowsDataContextValue<T extends object = Record<string, unknown>> = {
  sortedRows: DataTableRowItem<T>[];
  filteredRows: DataTableRowItem<T>[];
};

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);
DataTableContext.displayName = "DataTable.Context";

export const RowsDataContext = createContext<RowsDataContextValue<
  Record<string, unknown>
> | null>(null);
RowsDataContext.displayName = "DataTable.RowsDataContext";

export const TableSelectionContext =
  createContext<TableSelectionContextValue | null>(null);
TableSelectionContext.displayName = "DataTable.SelectionContext";

export const CustomSettingsContext =
  createContext<CustomSettingsContextValue | null>(null);
CustomSettingsContext.displayName = "CustomSettings.Context";

export const useDataTableContext = <
  T extends object = Record<string, unknown>,
>(): DataTableContextValue<T> => {
  const context = useContext(
    DataTableContext
  ) as DataTableContextValue<T> | null;
  const rowsData = useContext(
    RowsDataContext
  ) as RowsDataContextValue<T> | null;
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return useMemo(
    () => ({ ...context, ...rowsData }),
    [context, rowsData]
  ) as DataTableContextValue<T>;
};

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

export const useRowsDataContext = <
  T extends object = Record<string, unknown>,
>(): RowsDataContextValue<T> => {
  const context = useContext(RowsDataContext) as RowsDataContextValue<T> | null;
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
