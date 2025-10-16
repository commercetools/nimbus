import {
  Cell as RaCell,
  ButtonContext as RaButtonContext,
} from "react-aria-components";
import { extractStyleProps } from "@/utils";
import type { DataTableCellProps } from "../data-table.types";
import { DataTableCellSlot } from "../data-table.slots";

export const DataTableCell = ({
  ref,
  children,
  isDisabled,
  ...props
}: DataTableCellProps) => {
  // Basically here for disabling any child buttons via context (magic) when the row is disabled
  const [styleProps, restProps] = extractStyleProps(props);
  return (
    <DataTableCellSlot asChild {...styleProps}>
      <RaCell ref={ref} {...restProps}>
        {(renderProps) => (
          <RaButtonContext.Provider value={{ isDisabled }}>
            {typeof children === "function" ? children(renderProps) : children}
          </RaButtonContext.Provider>
        )}
      </RaCell>
    </DataTableCellSlot>
  );
};
