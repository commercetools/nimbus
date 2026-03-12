import figma from "@figma/code-connect/react";
import { PasswordInput } from "./password-input";

figma.connect(
  PasswordInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=3982-23614",
  {
    props: {
      leadingElement: figma.boolean("Leading element"),
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
    example: (props) => <PasswordInput {...props} />,
  }
);
