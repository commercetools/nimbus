import figma from "@figma/code-connect/react";
import { Separator } from "./separator";

// NOTE: Skipped VARIANT "Weight" [2px, 1px] → no matching code prop "weight"
figma.connect(
  Separator,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5210-14126",
  {
    props: {
      orientation: figma.enum("Orientation", {
        horizontal: "horizontal",
        Vertical: "vertical",
      }),
    },
    example: (props) => <Separator orientation={props.orientation} />,
  }
);
