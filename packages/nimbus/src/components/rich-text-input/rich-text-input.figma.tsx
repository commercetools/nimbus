import figma from "@figma/code-connect/react";
import { RichTextInput } from "./rich-text-input";

figma.connect(
  RichTextInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5921-47063",
  {
    props: {
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
    },
    example: (props) => <RichTextInput {...props} />,
  }
);
