import figma from "@figma/code-connect/react";
import { NumberInput } from "./number-input";

figma.connect(
  NumberInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3889-9483",
  {
    props: {
      leadingElement: figma.boolean("Leading element#7958:64"),
      trailingElement: figma.boolean("Trailing element#7958:81"),
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
    example: (props) => <NumberInput {...props} />,
  }
);
