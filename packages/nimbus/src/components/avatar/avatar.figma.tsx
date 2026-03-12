import figma from "@figma/code-connect/react";
import { Avatar } from "./avatar";

// --- Unmatched Figma properties (manual review needed) ---
// Style (VARIANT: Image, initials) — composition, no code equivalent

figma.connect(
  Avatar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=180-1106",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", {
        xs: "xs",
        "2xs": "2xs",
        md: "md",
      }),
      colorPalette: figma.enum("Color", {
        none: "none",
        Primary: "primary",
        Critical: "critical",
        Warning: "warning",
      }),
    },
    example: (props) => <Avatar {...props} />,
  }
);
