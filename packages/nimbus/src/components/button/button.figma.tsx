import figma from "@figma/code-connect/react";
import { Button } from "./button";

figma.connect(
  Button,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=67-549",
  {
    props: {
      iconRight: figma.instance("→ Icon right#67:2"),
      iconLeft: figma.instance("→ Icon Left#67:3"),
      leftIcon: figma.boolean("Left icon#2415:0"),
      rightIcon: figma.boolean("Right icon#2415:97"),
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
    example: (props) => <Button {...props} />,
  }
);
