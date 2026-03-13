import figma from "@figma/code-connect/react";
import { Alert } from "./alert";

figma.connect(
  Alert.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=339-5419",
  {
    props: {
      isClearable: figma.boolean("Clear button"),
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
    example: (props) => (
      <Alert.Root
        isClearable={props.isClearable}
        colorPalette={props.colorPalette}
        variant={props.variant}
      >
        Alert message
      </Alert.Root>
    ),
  }
);

// --- Variant-specific: Critical alert ---
figma.connect(
  Alert.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=339-5419",
  {
    variant: { Tone: "Critical" },
    example: () => (
      <Alert.Root colorPalette="critical" variant="outlined">
        Something went wrong. Please try again.
      </Alert.Root>
    ),
  }
);

// --- Variant-specific: Positive alert ---
figma.connect(
  Alert.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=339-5419",
  {
    variant: { Tone: "Positive" },
    example: () => (
      <Alert.Root colorPalette="positive" variant="outlined">
        Changes saved successfully.
      </Alert.Root>
    ),
  }
);

// --- Variant-specific: Warning alert ---
figma.connect(
  Alert.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=339-5419",
  {
    variant: { Tone: "Warning" },
    example: () => (
      <Alert.Root colorPalette="warning" variant="outlined">
        Please review before continuing.
      </Alert.Root>
    ),
  }
);
