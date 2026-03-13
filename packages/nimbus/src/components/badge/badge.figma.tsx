import figma from "@figma/code-connect/react";
import { Badge } from "./badge";

figma.connect(
  Badge,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2656-4638",
  {
    props: {
      iconLeft: figma.boolean("Left icon", {
        true: figma.instance("→ Icon Left"),
        false: undefined,
      }),
      iconRight: figma.boolean("Right icon", {
        true: figma.instance("→ Icon right"),
        false: undefined,
      }),
      children: figma.string("Label"),
      size: figma.enum("Size", {
        md: "md",
        xs: "xs",
        "2xs": "2xs",
      }),
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
        {props.iconLeft}
        {props.children}
        {props.iconRight}
      </Badge>
    ),
  }
);
