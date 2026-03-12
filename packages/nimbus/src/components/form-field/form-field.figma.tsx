import figma from "@figma/code-connect/react";
import { FormField } from "./form-field";

// --- Form field → FormField.Root ---
figma.connect(
  FormField.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=349-2763",
  {
    props: {
      isRequired: figma.boolean("is required#349:18"),
      direction: figma.enum("Label placement", {
        Top: "column",
        left: "row",
      }),
      size: figma.enum("Size", {
        xs: "xs",
        md: "md",
      }),
    },
    example: (props) => (
      <FormField.Root
        isRequired={props.isRequired}
        direction={props.direction}
        size={props.size}
      />
    ),
  }
);

// --- Field message → FormField.Error ---
figma.connect(
  FormField.Error,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2289-1115",
  {
    example: () => <FormField.Error />,
  }
);
