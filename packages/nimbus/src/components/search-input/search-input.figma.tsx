import figma from "@figma/code-connect/react";
import { SearchInput } from "./search-input";

// NOTE: Skipped BOOLEAN "Clear button" → no matching code prop found
// NOTE: Skipped State "Placeholder" → no mapping in STATE_BOOLEAN_MAP
figma.connect(
  SearchInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6005-17483",
  {
    props: {
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Appearance", { Solid: "solid", Ghost: "ghost" }),
      size: figma.enum("Size", { md: "md", sm: "sm" }),
    },
    example: (props) => (
      <SearchInput
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        variant={props.variant}
        size={props.size}
      >
        {/* label placeholder */}
      </SearchInput>
    ),
  }
);
