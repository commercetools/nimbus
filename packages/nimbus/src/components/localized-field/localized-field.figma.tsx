import figma from "@figma/code-connect/react";
import { LocalizedField } from "./localized-field";

figma.connect(
  LocalizedField,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5903-40047",
  {
    props: {
      defaultExpanded: figma.enum("Expanded", { YES: true }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
      }),
    },
    example: (props) => (
      <LocalizedField
        defaultExpanded={props.defaultExpanded}
        size={props.size}
      />
    ),
  }
);
