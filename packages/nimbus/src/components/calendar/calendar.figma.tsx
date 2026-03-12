import figma from "@figma/code-connect/react";
import { Calendar } from "./calendar";

// --- Unmatched Figma properties (manual review needed) ---
// Variant (VARIANT: Date-time range, Date-time, Date range, Date)

figma.connect(
  Calendar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    example: () => <Calendar />,
  }
);
