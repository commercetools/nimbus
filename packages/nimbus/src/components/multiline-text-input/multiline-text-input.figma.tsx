import figma from "@figma/code-connect/react";
import { MultilineTextInput } from "./multiline-text-input";

// NOTE: Skipped BOOLEAN "Trailing element" → no matching code prop found
figma.connect(
  MultilineTextInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4610-25596",
  {
    props: {
      leadingElement: figma.boolean("Leading element"),
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { md: "md", sm: "sm" }),
      variant: figma.enum("Appearance", { Solid: "solid", Ghost: "ghost" }),
    },
    example: (props) => (
      <MultilineTextInput
        leadingElement={props.leadingElement}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        size={props.size}
        variant={props.variant}
      >
        {/* label placeholder */}
      </MultilineTextInput>
    ),
  }
);
