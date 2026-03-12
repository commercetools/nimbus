import figma from "@figma/code-connect/react";
import { IconButton } from "./icon-button";

figma.connect(
  IconButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=108-109",
  {
    props: {
      icon: figma.instance("Icon#67:3"),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
        xs: "xs",
        "2xs": "2xs",
      }),
      colorPalette: figma.enum("Tone", {
        Critical: "critical",
        Primary: "primary",
      }),
    },
    example: (props) => (
      <IconButton
        aria-label="Action"
        variant={props.variant}
        size={props.size}
        colorPalette={props.colorPalette}
        isDisabled={props.isDisabled}
      >
        {props.icon}
      </IconButton>
    ),
  }
);
