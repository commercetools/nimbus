import figma from "@figma/code-connect/react";
import { FormField } from "./form-field";

// --- Form field → FormField.Root ---
figma.connect(
  FormField.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=349-2763",
  {
    props: {
      isRequired: figma.boolean("is required"),
      direction: figma.enum("Label placement", {
        Top: "column",
        left: "row",
      }),
      size: figma.enum("Size", {
        xs: "xs",
        md: "md",
      }),
      infoBox: figma.boolean("Info", {
        true: <FormField.InfoBox>Additional info</FormField.InfoBox>,
        false: undefined,
      }),
      input: figma.instance("Input type"),
      children: figma.children("*"),
    },
    example: (props) => (
      <FormField.Root
        isRequired={props.isRequired}
        direction={props.direction}
        size={props.size}
      >
        <FormField.Label>Label</FormField.Label>
        {props.infoBox}
        {props.children}
      </FormField.Root>
    ),
  }
);

// --- Field message (Error) → FormField.Error ---
figma.connect(
  FormField.Error,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2289-1115",
  {
    variant: { "Message style": "Error" },
    example: () => <FormField.Error>Error message</FormField.Error>,
  }
);

// --- Field message (Help text) → FormField.Description ---
figma.connect(
  FormField.Description,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2289-1115",
  {
    variant: { "Message style": "Help text" },
    example: () => <FormField.Description>Help text</FormField.Description>,
  }
);
