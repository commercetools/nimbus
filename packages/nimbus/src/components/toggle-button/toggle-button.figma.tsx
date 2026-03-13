import figma from "@figma/code-connect/react";
import { ToggleButton } from "./toggle-button";

figma.connect(
  ToggleButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5707-16295",
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
    example: (props) => (
      <ToggleButton
        variant={props.variant}
        size={props.size}
        isDisabled={props.isDisabled}
        isSelected={props.isSelected}
      >
        {props.iconLeft}
        Toggle
        {props.iconRight}
      </ToggleButton>
    ),
  }
);
