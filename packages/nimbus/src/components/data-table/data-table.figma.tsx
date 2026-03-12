import figma from "@figma/code-connect/react";
import { DataTable } from "./data-table";

// --- Unmatched Figma properties (manual review needed) ---
// Content type (VARIANT) — composition, maps to cell content not DataTable props
// Sublabel (TEXT) — composition concern
// Text (TEXT) — composition concern

figma.connect(
  DataTable,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6041-28672",
  {
    example: () => <DataTable />,
  }
);
