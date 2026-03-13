import figma from "@figma/code-connect/react";
import { ScopedSearchInput } from "./scoped-search-input";

figma.connect(
  ScopedSearchInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=7190-35662",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", {
        sm: "sm",
        md: "md",
      }),
    },
    example: (props) => (
      <ScopedSearchInput isDisabled={props.isDisabled} size={props.size} />
    ),
  }
);
