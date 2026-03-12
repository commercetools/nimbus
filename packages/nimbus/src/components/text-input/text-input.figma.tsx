import figma from "@figma/code-connect/react";
import { TextInput } from "./text-input";

figma.connect(
  TextInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=95-879",
  {
    props: {
      trailingElement: figma.boolean("Trailing element#7190:0"),
      leadingElement: figma.boolean("Leading element#7190:17"),
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
    example: (props) => <TextInput {...props} />,
  }
);
