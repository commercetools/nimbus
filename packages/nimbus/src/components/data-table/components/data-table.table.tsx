import { createContext, useContext, useMemo, useRef } from "react";
import {
  Table as RaTable,
  TableLayout as RaTableLayout,
  Virtualizer as RaVirtualizer,
  type SortDescriptor,
} from "react-aria-components";
import { Virtualizer } from "../../virtualizer/virtualizer";
import type { VirtualizerTableLayoutOptions } from "../../virtualizer/virtualizer.types";

// SPIKE (FEC-1145, not shipped): lets the spike story turn on the
// Virtualizer without a public prop. Removed after the findings are written.
export type DataTableSpikeVirtualizerValue =
  false | { options: VirtualizerTableLayoutOptions; stickyColumns: boolean };
export const DataTableSpikeVirtualizerContext =
  createContext<DataTableSpikeVirtualizerValue>(false);

const SPIKE_STICKY_KEYS = new Set(["__nimbus-drag__", "selection", "pin-rows"]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SpikeStickyTableLayout extends RaTableLayout<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isStickyColumn(node: any) {
    // React Aria asks for columns and for body cells; a cell is sticky when
    // its column is.
    const column =
      node.type === "column"
        ? node
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this.virtualizer?.collection as any)?.columns[
            node.colIndex ?? node.index
          ];
    const className = String(column?.props?.className ?? "");
    return (
      SPIKE_STICKY_KEYS.has(String(column?.key)) ||
      className.includes("expand-column-header")
    );
  }
}
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import {
  useStableDataTableContext,
  useInteractionContext,
  useTableSelectionContext,
} from "./data-table.context";
import { DataTableTableSlot } from "../data-table.slots";
import type { DataTableTableSlotProps } from "../data-table.types";
import { dataTableMessagesStrings } from "../data-table.messages";

/**
 * DataTable.Table - The main table element that wraps the header and body components
 *
 * @supportsStyleProps
 */
export const DataTableTable = function DataTableTable({
  ref: forwardedRef,
  children,
  "aria-label": ariaLabelProp,
  dragAndDropHooks,
  ...props
}: DataTableTableSlotProps) {
  const localRef = useRef<HTMLTableElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const {
    onSortChange,
    selectionMode,
    disallowEmptySelection,
    disabledKeys,
    hasRenderNestedContent,
    rows,
    getRowKey,
  } = useStableDataTableContext();
  const { sortDescriptor, expanded } = useInteractionContext();

  // React Aria's `disabledKeys` is an `Iterable<Key>`, so the string "all"
  // would iterate to the keys "a", "l", "l". Expand it to every row id.
  const ariaDisabledKeys = useMemo(
    () =>
      disabledKeys === "all" ? new Set(rows.map(getRowKey)) : disabledKeys,
    [disabledKeys, rows, getRowKey]
  );

  const { selectedKeys, defaultSelectedKeys, onSelectionChange } =
    useTableSelectionContext();

  const [styleProps, restProps] = extractStyleProps(props);

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTable");

  // Convert sort descriptor to react-aria format
  const ariaSortDescriptor = sortDescriptor
    ? {
        column: sortDescriptor.column,
        direction: sortDescriptor.direction,
      }
    : undefined;

  // Handle sort change from react-aria
  const handleAriaSort = (descriptor: SortDescriptor) => {
    if (descriptor && onSortChange) {
      onSortChange({
        column: String(descriptor.column),
        direction: descriptor.direction,
      });
    }
  };

  const spikeVirtualizerOptions = useContext(DataTableSpikeVirtualizerContext);

  const table = (
    <DataTableTableSlot {...styleProps} asChild>
      <RaTable
        ref={ref}
        aria-label={ariaLabel}
        sortDescriptor={ariaSortDescriptor}
        onSortChange={handleAriaSort}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection}
        disabledKeys={ariaDisabledKeys}
        disabledBehavior="all"
        // nestedKey rows manage expansion internally; only renderNestedContent needs React Aria to track expanded state for aria-expanded
        expandedKeys={hasRenderNestedContent ? expanded : undefined}
        dragAndDropHooks={dragAndDropHooks}
        {...restProps}
      >
        {children}
      </RaTable>
    </DataTableTableSlot>
  );

  if (spikeVirtualizerOptions === false) return table;
  if (spikeVirtualizerOptions.stickyColumns) {
    return (
      <RaVirtualizer
        layout={SpikeStickyTableLayout}
        layoutOptions={spikeVirtualizerOptions.options}
        shouldObserveItemSize
      >
        {table}
      </RaVirtualizer>
    );
  }
  return (
    <Virtualizer layout="table" layoutOptions={spikeVirtualizerOptions.options}>
      {table}
    </Virtualizer>
  );
};

DataTableTable.displayName = "DataTable.Table";
