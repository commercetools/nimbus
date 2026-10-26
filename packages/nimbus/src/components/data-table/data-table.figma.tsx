import figma from "@figma/code-connect/react";
import { DataTable } from "./data-table";

// --- Table cell → DataTable.Cell ---
//
// Figma has no component for the whole table, only for its cells, so the
// cell is connected to DataTable.Cell. The "Content type" variant has no code
// counterpart: the consumer renders the content inside the cell.
figma.connect(
  DataTable.Cell,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6041-28672",
  {
    props: {
      children: figma.string("Text"),
    },
    example: (props) => <DataTable.Cell>{props.children}</DataTable.Cell>,
  }
);
