import figma from "@figma/code-connect/react";
import { TagGroup } from "./tag-group";

// --- Tag → TagGroup.Tag ---
figma.connect(
  TagGroup.Tag,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3966-10081",
  {
    props: {
      isClearable: figma.boolean("Clear button"),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
        lg: "lg",
      }),
      isDisabled: figma.enum("State", { Disabled: true }),
    },
    example: (props) => <TagGroup.Tag {...props} />,
  }
);

// --- Tag group → TagGroup.Root ---
// --- Unmatched Figma properties (manual review needed) ---
// Variant (VARIANT: Tag group, Toggle group)

figma.connect(
  TagGroup.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3966-10094",
  {
    props: {
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
        lg: "lg",
      }),
    },
    example: (props) => <TagGroup.Root {...props} />,
  }
);
