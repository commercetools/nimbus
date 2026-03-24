import figma from "@figma/code-connect/react";
import { Select } from "./select";

// --- Select Menu → Select.Options ---
figma.connect(
  Select.Options,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6358-56585",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <Select.Options>{props.children}</Select.Options>,
  }
);

// --- SelectInput → Select.Root ---
// NOTE: Skipped BOOLEAN "Leading element" → no matching code prop found
figma.connect(
  Select.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=271-412",
  {
    props: {
      size: figma.enum("Size", { md: "md", sm: "sm" }),
      children: figma.children("*"),
      variant: figma.enum("Appearance", { Solid: "outline", Ghost: "ghost" }),
    },
    example: (props) => (
      <Select.Root variant={props.variant} size={props.size}>
        <Select.Options>{/* Option items */}</Select.Options>
      </Select.Root>
    ),
  }
);
