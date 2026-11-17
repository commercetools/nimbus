import figma from "@figma/code-connect/react";
import { ActivityIndicator } from "./activity-indicator";

figma.connect(
  ActivityIndicator,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=12468-78126",
  {
    props: {
      size: figma.enum("size", {
        inherit: "inherit",
        "2xs": "2xs",
        xs: "xs",
        sm: "sm",
        md: "md",
        lg: "lg",
      }),
    },
    example: (props) => <ActivityIndicator size={props.size} />,
  }
);
