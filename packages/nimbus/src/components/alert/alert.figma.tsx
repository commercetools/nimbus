import figma from "@figma/code-connect/react";
import { Alert } from "./alert";

// NOTE: The connected Figma component only exposes `Tone`
// (Critical/Info/Warning/Positive — no Neutral yet) and `Variant`
// (Outlined/Ghost). The code's newer `layout` axis (stack/inline/banner) and
// the `outline`/`solid` emphasis values have no Figma-side representation
// yet, so they are intentionally not mapped here.
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
      // "Outlined" is Figma's tinted-card treatment, which the code now
      // calls `subtle` (`outlined` remains only as a deprecated alias).
      // "Ghost" maps to the code's `flat` (no-chrome) variant.
      variant: figma.enum("Variant", { Outlined: "subtle", Ghost: "flat" }),
      // Previously unmapped ("no matching code prop found"); now maps to the
      // `dismissible` convenience prop added to Alert.Root.
      dismissible: figma.boolean("Clear button"),
    },
    example: (props) => (
      <Alert.Root
        colorPalette={props.colorPalette}
        variant={props.variant}
        dismissible={props.dismissible}
      >
        {props.children}
      </Alert.Root>
    ),
  }
);
