import figma from "@figma/code-connect/react";
import { Calendar } from "./calendar";

figma.connect(
  Calendar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    example: () => <Calendar />,
  }
);

// --- Variant-specific: Single date ---
figma.connect(
  Calendar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    variant: { Variant: "Date" },
    example: () => <Calendar />,
  }
);

// --- Variant-specific: Date range ---
figma.connect(
  Calendar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    variant: { Variant: "Date range" },
    example: () => <Calendar selectionMode="range" />,
  }
);
