import { createContext, useContext } from "react";
import type {
  DataTableContextValue,
  CustomSettingsContextValue,
  TableSelectionContextValue,
} from "../data-table.types";

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);
DataTableContext.displayName = "DataTable.Context";

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
