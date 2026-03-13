import figma from "@figma/code-connect/react";
import { SearchInput } from "./search-input";

figma.connect(
  SearchInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=6005-17483",
  {
    props: {
      isClearable: figma.boolean("Clear button"),
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      variant: figma.enum("Appearance", {
        Solid: "solid",
        Ghost: "ghost",
      }),
      size: figma.enum("Size", {
        md: "md",
        sm: "sm",
      }),
    },
    example: (props) => (
      <SearchInput
        variant={props.variant}
        size={props.size}
        isClearable={props.isClearable}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
      />
    ),
  }
);
