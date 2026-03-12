import figma from "@figma/code-connect/react";
import { ToggleButton } from "./toggle-button";

figma.connect(
  ToggleButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5707-16295",
  {
    props: {
      iconRight: figma.instance("→ Icon right"),
      iconLeft: figma.instance("→ Icon Left"),
      leftIcon: figma.boolean("Left icon"),
      rightIcon: figma.boolean("Right icon"),
      variant: figma.enum("Variant", {
        Outlined: "outline",
        Ghost: "ghost",
      }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
        xs: "xs",
        "2xs": "2xs",
      }),
      isSelected: figma.enum("Toggled", { YES: true }),
    },
    example: (props) => <ToggleButton {...props} />,
  }
);
