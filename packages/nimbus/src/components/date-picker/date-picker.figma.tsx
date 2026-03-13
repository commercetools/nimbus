import figma from "@figma/code-connect/react";
import { DatePicker } from "./date-picker";

figma.connect(
  DatePicker,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2960-3987",
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
    example: (props) => (
      <DatePicker
        variant={props.variant}
        size={props.size}
        leadingElement={props.leadingElement}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
      />
    ),
  }
);
