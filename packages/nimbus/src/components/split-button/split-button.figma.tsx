import figma from "@figma/code-connect/react";
import { SplitButton } from "./split-button";

figma.connect(
  SplitButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5748-38651",
  {
    props: {
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
        Ghost: "ghost",
      }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { md: "md", sm: "sm", xs: "xs", "2xs": "2xs" }),
    },
    example: (props) => (
      <SplitButton
        aria-label="Action"
        variant={props.variant}
        size={props.size}
        isDisabled={props.isDisabled}
        onAction={() => {}}
      >
        Item Placeholder
      </SplitButton>
    ),
  }
);
