import figma from "@figma/code-connect/react";
import { NumberInput } from "./number-input";

figma.connect(
  NumberInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3889-9483",
  {
    props: {
      leadingElement: figma.boolean("Leading element"),
      trailingElement: figma.boolean("Trailing element"),
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Appearance", {
        Solid: "solid",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
      }),
    },
    example: (props) => (
      <NumberInput
        variant={props.variant}
        size={props.size}
        leadingElement={props.leadingElement}
        trailingElement={props.trailingElement}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
      />
    ),
  }
);
