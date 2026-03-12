import figma from "@figma/code-connect/react";
import { TimeInput } from "./time-input";

figma.connect(
  TimeInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3047-46448",
  {
    props: {
      leadingElement: figma.boolean("Leading element#8009:115"),
      trailingElement: figma.boolean("Trailing element#8009:132"),
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
    example: (props) => <TimeInput {...props} />,
  }
);
