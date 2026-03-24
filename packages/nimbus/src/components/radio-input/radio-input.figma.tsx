import figma from "@figma/code-connect/react";
import { RadioInput } from "./radio-input";

// --- Radio button with label → RadioInput.Option ---
// NOTE: Skipped VARIANT "Validation" [none, Invalid, Disabled] → no matching code prop "validation"
figma.connect(
  RadioInput.Option,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2999-6090",
  {
    example: () => (
      <RadioInput.Option value="">{/* label */}</RadioInput.Option>
    ),
  }
);

// --- Radio group → RadioInput.Root ---
// NOTE: Skipped BOOLEAN "Option 1" → no matching code prop found
// NOTE: Skipped BOOLEAN "Option 2" → no matching code prop found
// NOTE: Skipped BOOLEAN "Option 3" → no matching code prop found
// NOTE: Skipped BOOLEAN "Option 4" → no matching code prop found
// NOTE: Skipped BOOLEAN "Option 5" → no matching code prop found
figma.connect(
  RadioInput.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2999-6110",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Vertical: "vertical",
        horizontal: "horizontal",
      }),
      children: figma.children("*"),
    },
    example: (props) => (
      <RadioInput.Root orientation={props.orientation}>
        {props.children}
      </RadioInput.Root>
    ),
  }
);
