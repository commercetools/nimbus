import figma from "@figma/code-connect/react";
import { TimeInput } from "./time-input";

figma.connect(
  TimeInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3047-46448",
  {
    props: {
      leadingElement: figma.boolean("Leading element"),
      trailingElement: figma.boolean("Trailing element"),
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { md: "md", sm: "sm" }),
      variant: figma.enum("Appearance", { Solid: "solid", Ghost: "ghost" }),
    },
    example: (props) => (
      <TimeInput
        leadingElement={props.leadingElement}
        trailingElement={props.trailingElement}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        size={props.size}
        variant={props.variant}
      >
        {/* label placeholder */}
      </TimeInput>
    ),
  }
);
