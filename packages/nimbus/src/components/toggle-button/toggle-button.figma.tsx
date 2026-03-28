import figma from "@figma/code-connect/react";
import { ToggleButton } from "./toggle-button";

// NOTE: Skipped BOOLEAN+INSTANCE "Left icon" → no matching code prop "iconLeft"
// NOTE: Skipped BOOLEAN+INSTANCE "Right icon" → no matching code prop "iconRight"
figma.connect(
  ToggleButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5707-16295",
  {
    props: {
      variant: figma.enum("Variant", { Outlined: "outline", Ghost: "ghost" }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { md: "md", sm: "sm", xs: "xs", "2xs": "2xs" }),
      isSelected: figma.enum("Toggled", { YES: true }),
    },
    example: (props) => (
      <ToggleButton
        variant={props.variant}
        isDisabled={props.isDisabled}
        size={props.size}
        isSelected={props.isSelected}
      >
        {/* label placeholder */}
      </ToggleButton>
    ),
  }
);
