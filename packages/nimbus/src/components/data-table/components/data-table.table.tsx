import { useRef } from "react";
import { Table as RaTable, type SortDescriptor } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useDataTableContext } from "./data-table.context";
import {
  DataTableTableSlot,
  type DataTableTableSlotProps,
} from "../data-table.slots";

export const DataTableTable = function DataTableTable({
  ref: forwardedRef,
  children,
  ...props
}: DataTableTableSlotProps) {
  const localRef = useRef<HTMLTableElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const {
    sortDescriptor,
    onSortChange,
    selectionMode,
    onSelectionChange,
    selectedKeys,
    defaultSelectedKeys,
    disallowEmptySelection,
    disabledKeys,
  } = useDataTableContext();

  const [styleProps, restProps] = extractStyleProps(props);

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

  return (
    <DataTableTableSlot {...styleProps} asChild>
      <RaTable
        ref={ref}
        sortDescriptor={ariaSortDescriptor}
        onSortChange={handleAriaSort}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection}
        disabledKeys={disabledKeys}
        disabledBehavior="all"
        {...restProps}
      >
        {children}
      </RaTable>
    </DataTableTableSlot>
  );
};

DataTableTable.displayName = "DataTable.Table";
