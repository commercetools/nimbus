import figma from "@figma/code-connect/react";
import { Button } from "./button";

figma.connect(
  Button,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=67-549",
  {
    props: {
      iconRight: figma.boolean("Right icon", {
        true: figma.instance("→ Icon right"),
        false: undefined,
      }),
      iconLeft: figma.boolean("Left icon", {
        true: figma.instance("→ Icon Left"),
        false: undefined,
      }),
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
        Ghost: "ghost",
        Link: "link",
      }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
        xs: "xs",
        "2xs": "2xs",
      }),
      colorPalette: figma.enum("Tone", {
        Primary: "primary",
        Critical: "critical",
      }),
    },
    example: (props) => (
      <Button
        variant={props.variant}
        size={props.size}
        colorPalette={props.colorPalette}
        isDisabled={props.isDisabled}
      >
        {props.iconLeft}
        Button label
        {props.iconRight}
      </Button>
    ),
  }
);
