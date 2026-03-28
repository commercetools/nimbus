import figma from "@figma/code-connect/react";
import { Tooltip } from "./tooltip";

// NOTE: Skipped VARIANT "Property 1" [Default] → no matching code prop "property"
figma.connect(
  Tooltip.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=346-862",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <Tooltip.Root>{props.children}</Tooltip.Root>,
  }
);
