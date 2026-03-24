import figma from "@figma/code-connect/react";
import { TagGroup } from "./tag-group";

// --- Tag → TagGroup.Tag ---
figma.connect(
  TagGroup.Tag,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3966-10081",
  {
    example: () => <TagGroup.Tag />,
  }
);

// --- Tag group → TagGroup.Root ---
figma.connect(
  TagGroup.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3966-10094",
  {
    props: {
      size: figma.enum("Size", { md: "md", sm: "sm", lg: "lg" }),
      children: figma.children("*"),
    },
    example: (props) => (
      <TagGroup.Root size={props.size}>{props.children}</TagGroup.Root>
    ),
  }
);
