import figma from "@figma/code-connect/react";
import { ActivityIndicator } from "./activity-indicator";

figma.connect(
  ActivityIndicator,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=10603-16574",
  {
    props: {
      size: figma.enum("Size", {
        lg: "lg",
        md: "md",
        sm: "sm",
        xs: "xs",
        "2xs": "2xs",
      }),
      // Figma's "white" color (dots on a solid surface) maps to the `contrast`
      // variant; "primary" is the default and needs no prop.
      variant: figma.enum("Color", { white: "contrast" }),
    },
    example: (props) => (
      <ActivityIndicator size={props.size} variant={props.variant} />
    ),
  }
);
