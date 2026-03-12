import figma from "@figma/code-connect/react";
import { LoadingSpinner } from "./loading-spinner";

figma.connect(
  LoadingSpinner,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=352-1251",
  {
    props: {
      size: figma.enum("Size", {
        lg: "lg",
        md: "md",
        sm: "sm",
        xs: "xs",
        "2xs": "2xs",
      }),
      colorPalette: figma.enum("Color", {
        primary: "primary",
        white: "white",
      }),
    },
    example: (props) => <LoadingSpinner {...props} />,
  }
);
