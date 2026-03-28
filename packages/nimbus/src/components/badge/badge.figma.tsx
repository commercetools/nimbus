import figma from "@figma/code-connect/react";
import { Badge } from "./badge";

// NOTE: Skipped BOOLEAN+INSTANCE "Left icon" → no matching code prop "iconLeft"
// NOTE: Skipped BOOLEAN+INSTANCE "Right icon" → no matching code prop "iconRight"
figma.connect(
  Badge,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2656-4638",
  {
    props: {
      children: figma.string("Label"),
      size: figma.enum("Size", { md: "md", xs: "xs", "2xs": "2xs" }),
      colorPalette: figma.enum("Color", {
        Primary: "primary",
        Critical: "critical",
        Positive: "positive",
        Warning: "warning",
        Info: "info",
        Neutral: "neutral",
      }),
    },
    example: (props) => (
      <Badge size={props.size} colorPalette={props.colorPalette}>
        {props.children}
      </Badge>
    ),
  }
);
