import type { ContextType } from "react";
import type { TableStateContext as RaTableStateContext } from "react-aria-components";

/**
 * What the rows, the header and the cells of one table tell `apiRef`. Writing
 * to it does not re-render anything. Internal: not exported from the package.
 */
export type DataTableRegistry = {
  /** The element of each rendered row, by row key. */
  rowElements: Map<string, HTMLElement>;
  /** The header element, which stays on top of the rows while scrolling. */
  headerElement: HTMLElement | null;
  /** React Aria's table state. A new object after every render of the table. */
  tableState: NonNullable<ContextType<typeof RaTableStateContext>> | null;
};
