import figma from "@figma/code-connect/react";
import { MoneyInput } from "./money-input";

figma.connect(
  MoneyInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5424-21590",
  {
    props: {
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", { sm: "sm", md: "md" }),
    },
    example: (props) => (
      <MoneyInput
        value={{ amount: "", currencyCode: "" }}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        size={props.size}
      />
    ),
  }
);
