import { createContext, useContext } from "react";
import type {
  DataTableContextValue,
  CustomSettingsContextValue,
} from "../data-table.types";

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);
DataTableContext.displayName = "DataTable.Context";

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

export const useCustomSettingsContext = () => {
  const context = useContext(CustomSettingsContext);
  if (!context) {
    throw new Error("CustomSettings context not found");
  }
  return context;
};
