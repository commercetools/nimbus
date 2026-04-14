import figma from "@figma/code-connect/react";
import { Button } from "./button";

// NOTE: Skipped BOOLEAN+INSTANCE "Left icon" → no matching code prop "iconLeft"
// NOTE: Skipped BOOLEAN+INSTANCE "Right icon" → no matching code prop "iconRight"
figma.connect(
  Button,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=67-549",
  {
    props: {
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
        Ghost: "ghost",
        Link: "link",
      }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { md: "md", sm: "sm", xs: "xs", "2xs": "2xs" }),
      colorPalette: figma.enum("Tone", {
        Primary: "primary",
        Critical: "critical",
      }),
    },
    example: (props) => (
      <Button
        variant={props.variant}
        isDisabled={props.isDisabled}
        size={props.size}
        colorPalette={props.colorPalette}
      >
        {/* label placeholder */}
      </Button>
    ),
  }
);
