import { useContext, useEffect } from "react";
import { TableStateContext } from "react-aria-components";
import { useStableDataTableContext } from "./data-table.context";

/**
 * Hands React Aria's table state to `apiRef`. Renders nothing.
 *
 * React Aria renders `DataTable.Row` and `DataTable.Column` outside the table's
 * state context; their content is rendered inside it, so
 * `TableStateContext` is only available there (as in `NestedContentPanel`).
 * It lives in column content because the header stays mounted when rows come
 * and go.
 *
 * React Aria gives the table a new state object on every render, and an old
 * one does not know about rows that were added later. So this writes the
 * latest state after every change, and clears it only if it is still its own.
 */
export const TableStateRegistrar = () => {
  const tableState = useContext(TableStateContext);
  const { registry } = useStableDataTableContext();

  useEffect(() => {
    registry.tableState = tableState;
    return () => {
      if (registry.tableState === tableState) registry.tableState = null;
    };
  }, [registry, tableState]);

  return null;
};

TableStateRegistrar.displayName = "DataTable.TableStateRegistrar";
