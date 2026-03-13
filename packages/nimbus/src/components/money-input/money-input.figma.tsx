import figma from "@figma/code-connect/react";
import { MoneyInput } from "./money-input";

figma.connect(
  MoneyInput,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5424-21590",
  {
    props: {
      hasHighPrecisionBadge: figma.boolean("High precision indicator"),
      isInvalid: figma.enum("State", { Invalid: true }),
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Size", {
        sm: "sm",
        md: "md",
      }),
    },
    example: (props) => (
      <MoneyInput
        size={props.size}
        hasHighPrecisionBadge={props.hasHighPrecisionBadge}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
      />
    ),
  }
);
