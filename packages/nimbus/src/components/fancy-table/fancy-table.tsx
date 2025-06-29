import {
  FancyTableRoot,
  FancyTableColumn,
  FancyTableRow,
  FancyTableHeader,
  FancyTableBody,
  FancyTableCell,
} from "./components";

// Create the namespace object
export const FancyTable = {
  Root: FancyTableRoot,
  Column: FancyTableColumn,
  Row: FancyTableRow,
  Header: FancyTableHeader,
  Body: FancyTableBody,
  Cell: FancyTableCell,
};

// Export individual components with underscore prefix for direct access
export {
  FancyTableRoot as _FancyTableRoot,
  FancyTableColumn as _FancyTableColumn,
  FancyTableRow as _FancyTableRow,
  FancyTableHeader as _FancyTableHeader,
  FancyTableBody as _FancyTableBody,
  FancyTableCell as _FancyTableCell,
};
