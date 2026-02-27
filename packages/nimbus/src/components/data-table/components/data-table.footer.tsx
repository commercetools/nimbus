import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { DataTableFooter as DataTableFooterSlot } from "../data-table.slots";

export type DataTableFooterProps = {
  children?: React.ReactNode;
  /**
   * React ref to be forwarded to the footer element
   */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * DataTable.Footer - Optional footer section for displaying summary information, pagination, or actions
 *
 * @supportsStyleProps
 */
export const DataTableFooter = function DataTableFooter({
  ref: forwardedRef,
  children,
  ...props
}: DataTableFooterProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DataTableFooterSlot ref={ref} {...props}>
      {children}
    </DataTableFooterSlot>
  );
};

DataTableFooter.displayName = "DataTable.Footer";
