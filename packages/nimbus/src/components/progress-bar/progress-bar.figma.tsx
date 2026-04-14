import figma from "@figma/code-connect/react";
import { ProgressBar } from "./progress-bar";

figma.connect(
  ProgressBar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5346-23699",
  {
    props: {
      size: figma.enum("Size", { md: "md", "2xs": "2xs" }),
      isIndeterminate: figma.enum("Completeness", { Indeterminate: true }),
      value: figma.enum("Completeness", { "0%": 0, "50%": 50, "100%": 100 }),
      variant: figma.enum("Inverted", { NO: "solid", YES: "contrast" }),
    },
    example: (props) => (
      <ProgressBar
        size={props.size}
        isIndeterminate={props.isIndeterminate}
        value={props.value}
        variant={props.variant}
      />
    ),
  }
);
