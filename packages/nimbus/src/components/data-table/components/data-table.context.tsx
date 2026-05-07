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

export const DataTableContext = createContext<DataTableContextValue<
  Record<string, unknown>
> | null>(null);
DataTableContext.displayName = "DataTable.Context";

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

export const useDataTableContext = <
  T extends object = Record<string, unknown>,
>(): DataTableContextValue<T> => {
  const context = useContext(
    DataTableContext
  ) as DataTableContextValue<T> | null;
  const interactionData = useContext(
    InteractionContext
  ) as InteractionContextValue<T> | null;
  if (!context) {
    throw new Error("DataTable components must be used within DataTable.Root");
  }
  return useMemo(
    () => ({ ...context, ...interactionData }),
    [context, interactionData]
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
