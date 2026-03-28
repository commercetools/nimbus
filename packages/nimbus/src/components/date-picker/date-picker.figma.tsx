import figma from "@figma/code-connect/react";
import { DatePicker } from "./date-picker";

// NOTE: Skipped BOOLEAN "Clear button" → no matching code prop found
// NOTE: Skipped BOOLEAN "Leading element" → no matching code prop found
figma.connect(
  DatePicker,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2960-3987",
  {
    props: {
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Appearance", { Solid: "solid", Ghost: "ghost" }),
      size: figma.enum("Size", { md: "md", sm: "sm" }),
    },
    example: (props) => (
      <DatePicker
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        variant={props.variant}
        size={props.size}
      >
        {/* label placeholder */}
      </DatePicker>
    ),
  }
);
