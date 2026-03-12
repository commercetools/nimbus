import figma from "@figma/code-connect/react";
import { Tabs } from "./tabs";

figma.connect(
  Tabs.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2804-13138",
  {
    props: {
      size: figma.enum("Size", {
        lg: "lg",
        md: "md",
        sm: "sm",
      }),
      orientation: figma.enum("Direction", {
        horizontal: "horizontal",
        "Vertical left": "vertical",
        "Vertical right": "vertical",
      }),
      placement: figma.enum("Direction", {
        "Vertical left": "start",
        "Vertical right": "end",
      }),
    },
    example: (props) => (
      <Tabs.Root
        size={props.size}
        orientation={props.orientation}
        placement={props.placement}
      />
    ),
  }
);
