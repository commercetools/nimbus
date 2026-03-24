import figma from "@figma/code-connect/react";
import { LocalizedField } from "./localized-field";

// NOTE: Skipped VARIANT "Expanded" (boolean-like) → no matching code prop "expanded"
figma.connect(
  LocalizedField,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5903-40047",
  {
    props: {
      size: figma.enum("Size", { md: "md", sm: "sm" }),
    },
    example: (props) => (
      <LocalizedField
        defaultLocaleOrCurrency=""
        valuesByLocaleOrCurrency={{}}
        onChange={() => {}}
        size={props.size}
      />
    ),
  }
);
