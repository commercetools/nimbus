import { createContext, useContext } from "react";
import type { DataTableContextValue } from "../data-table.types";

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);

DataTableContext.displayName = "DataTable.Context";

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
