import figma from "@figma/code-connect/react";
import { Alert } from "./alert";

// NOTE: Skipped BOOLEAN "Clear button" → no matching code prop found
figma.connect(
  Alert.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=339-5419",
  {
    props: {
      colorPalette: figma.enum("Tone", {
        Critical: "critical",
        Info: "info",
        Warning: "warning",
        Positive: "positive",
      }),
      children: figma.children("*"),
      variant: figma.enum("Variant", { Outlined: "outlined", Ghost: "flat" }),
    },
    example: (props) => (
      <Alert.Root colorPalette={props.colorPalette} variant={props.variant}>
        {props.children}
      </Alert.Root>
    ),
  }
);
