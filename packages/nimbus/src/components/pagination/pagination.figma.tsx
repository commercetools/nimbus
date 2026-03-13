import figma from "@figma/code-connect/react";
import { Pagination } from "./pagination";

// --- Unmatched Figma properties (manual review needed) ---
// Variant (VARIANT: With jump to page, simple)

figma.connect(
  Pagination,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4044-13597",
  {
    example: () => <Pagination />,
  }
);
