import figma from "@figma/code-connect/react";
import { IconToggleButton } from "./icon-toggle-button";

figma.connect(
  IconToggleButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5729-17280",
  {
    props: {
      icon: figma.instance("Icon"),
      isDisabled: figma.enum("State", { Disabled: true }),
      isSelected: figma.enum("Toggled", { YES: true }),
      variant: figma.enum("Variant", {
        Ghost: "ghost",
        Outlined: "outline",
      }),
      size: figma.enum("Size", {
        xs: "xs",
        "2xs": "2xs",
        md: "md",
        sm: "sm",
      }),
    },
    example: (props) => (
      <IconToggleButton
        aria-label="Action"
        variant={props.variant}
        size={props.size}
        isDisabled={props.isDisabled}
        isSelected={props.isSelected}
      >
        {props.icon}
      </IconToggleButton>
    ),
  }
);
