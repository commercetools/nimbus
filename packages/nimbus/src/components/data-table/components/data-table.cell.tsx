import { forwardRef } from "react";
import {
  Cell as RaCell,
  type CellProps as RaCellProps,
  ButtonContext as RaButtonContext,
} from "react-aria-components";

export const DataTableCell = forwardRef<
  HTMLTableCellElement,
  RaCellProps & { isDisabled?: boolean }
>(function DataTableCell({ children, isDisabled, ...rest }, ref) {
  // Basically here for disabling any child buttons via context (magic) when the row is disabled
  // TODO: Perhaps this could use a slot and stylability?
  return (
    <RaCell ref={ref} {...rest}>
      {(renderProps) => (
        <RaButtonContext.Provider value={{ isDisabled }}>
          {typeof children === "function" ? children(renderProps) : children}
        </RaButtonContext.Provider>
      )}
    </RaCell>
  );
});
