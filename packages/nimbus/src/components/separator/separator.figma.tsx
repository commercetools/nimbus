import figma from "@figma/code-connect/react";
import { Separator } from "./separator";

// --- Unmatched Figma properties (manual review needed) ---
// Weight (VARIANT: 2px, 1px)

figma.connect(
  Separator,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5210-14126",
  {
    props: {
      orientation: figma.enum("Orientation", {
        horizontal: "horizontal",
        Vertical: "vertical",
      }),
    },
    example: (props) => <Separator {...props} />,
  }
);
