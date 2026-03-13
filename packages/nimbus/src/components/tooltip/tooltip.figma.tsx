import figma from "@figma/code-connect/react";
import { Tooltip } from "./tooltip";

// --- Unmatched Figma properties (manual review needed) ---
// Property 1 (VARIANT: Default)

figma.connect(
  Tooltip.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=346-862",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <Tooltip.Root>{props.children}</Tooltip.Root>,
  }
);
