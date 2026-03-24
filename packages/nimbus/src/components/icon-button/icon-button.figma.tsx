import figma from "@figma/code-connect/react";
import { IconButton } from "./icon-button";

// NOTE: Skipped INSTANCE_SWAP "Icon" → no matching code prop "icon"
figma.connect(
  IconButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=108-109",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", { md: "md", sm: "sm", xs: "xs", "2xs": "2xs" }),
      colorPalette: figma.enum("Tone", {
        Critical: "critical",
        Primary: "primary",
      }),
    },
    example: (props) => (
      <IconButton
        aria-label="Action"
        isDisabled={props.isDisabled}
        variant={props.variant}
        size={props.size}
        colorPalette={props.colorPalette}
      >
        {/* label placeholder */}
      </IconButton>
    ),
  }
);
