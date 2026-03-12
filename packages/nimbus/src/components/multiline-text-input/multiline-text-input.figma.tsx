import figma from "@figma/code-connect/react";
import { MultilineTextInput } from "./multiline-text-input";

figma.connect(
  MultilineTextInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4610-25596",
  {
    props: {
      showResizeIcon: figma.boolean("Show resize icon"),
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
    example: (props) => <MultilineTextInput {...props} />,
  }
);
