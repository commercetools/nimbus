import figma from "@figma/code-connect/react";
import { Alert } from "./alert";

figma.connect(
  Alert.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=339-5419",
  {
    props: {
      isClearable: figma.boolean("Clear button#339:0"),
      colorPalette: figma.enum("Tone", {
        Critical: "critical",
        Info: "info",
        Warning: "warning",
        Positive: "positive",
      }),
      variant: figma.enum("Variant", {
        Outlined: "outlined",
        Ghost: "flat",
      }),
    },
    example: (props) => <Alert.Root {...props} />,
  }
);
