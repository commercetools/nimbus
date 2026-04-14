import figma from "@figma/code-connect/react";
import { IconToggleButton } from "./icon-toggle-button";

// NOTE: Skipped INSTANCE_SWAP "Icon" → no matching code prop "icon"
figma.connect(
  IconToggleButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5729-17280",
  {
    props: {
      isSelected: figma.enum("State", { Selected: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Variant", { Ghost: "ghost", Outlined: "outline" }),
      size: figma.enum("Size", { xs: "xs", "2xs": "2xs", md: "md", sm: "sm" }),
    },
    example: (props) => (
      <IconToggleButton
        aria-label="Action"
        isSelected={props.isSelected}
        isDisabled={props.isDisabled}
        variant={props.variant}
        size={props.size}
      >
        {/* label placeholder */}
      </IconToggleButton>
    ),
  }
);
