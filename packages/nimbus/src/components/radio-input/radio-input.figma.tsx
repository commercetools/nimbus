import figma from "@figma/code-connect/react";
import { RadioInput } from "./radio-input";

// --- Radio button → RadioInput.Option ---
// --- Unmatched Figma properties (manual review needed) ---
// Checked (VARIANT: NO, YES)
// Validation (VARIANT: Invalid, none)

figma.connect(
  RadioInput.Option,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2999-6004",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
    },
    example: (props) => (
      <RadioInput.Option value="option" isDisabled={props.isDisabled}>
        Option label
      </RadioInput.Option>
    ),
  }
);

// --- Radio group → RadioInput.Root ---
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
