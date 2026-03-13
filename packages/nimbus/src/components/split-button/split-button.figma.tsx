import figma from "@figma/code-connect/react";
import { SplitButton } from "./split-button";

figma.connect(
  SplitButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5748-38651",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outline",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
        xs: "xs",
        "2xs": "2xs",
      }),
    },
    example: (props) => (
      <SplitButton
        aria-label="More actions"
        variant={props.variant}
        size={props.size}
        isDisabled={props.isDisabled}
        onAction={() => {}}
      >
        {/* Menu.Item children */}
      </SplitButton>
    ),
  }
);
