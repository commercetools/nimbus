import figma from "@figma/code-connect/react";
import { Select } from "./select";

// --- Select Menu → Select.Options ---
figma.connect(
  Select.Options,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-56585",
  {
    props: {},
    example: () => <Select.Options />,
  }
);

// --- SelectInput → Select.Root ---
figma.connect(
  Select.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=271-412",
  {
    props: {
      isClearable: figma.boolean("Clear button#274:0"),
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Appearance", {
        Solid: "outline",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
      }),
    },
    example: (props) => (
      <Select.Root
        isClearable={props.isClearable}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        variant={props.variant}
        size={props.size}
      />
    ),
  }
);
