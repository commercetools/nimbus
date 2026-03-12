import figma from "@figma/code-connect/react";
import { DatePicker } from "./date-picker";

figma.connect(
  DatePicker,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2960-3987",
  {
    props: {
      isClearable: figma.boolean("Clear button#274:0"),
      calendarButton: figma.boolean("Calendar button#6358:50"),
      leadingElement: figma.boolean("Leading element#8009:149"),
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
    example: (props) => <DatePicker {...props} />,
  }
);
