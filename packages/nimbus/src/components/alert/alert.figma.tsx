import figma from "@figma/code-connect/react";
import { Alert } from "./alert";

// NOTE: The connected Figma component only exposes `Tone`
// (Critical/Info/Warning/Positive — no Neutral yet) and `Variant`
// (Outlined/Ghost). The code's `accent-start` emphasis value has no Figma-side
// representation yet, so it is intentionally not mapped here. Figma's "Clear
// button" boolean has no code prop either: dismissal is composed with
// `Alert.DismissButton` rather than toggled from the root.
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
      // "Outlined" is Figma's tinted-card treatment, which the code calls
      // `outlined` too. "Ghost" maps to the code's `flat` (no-chrome) variant.
      variant: figma.enum("Variant", { Outlined: "outlined", Ghost: "flat" }),
    },
    example: (props) => (
      <Alert.Root colorPalette={props.colorPalette} variant={props.variant}>
        {props.children}
      </Alert.Root>
    ),
  }
);
