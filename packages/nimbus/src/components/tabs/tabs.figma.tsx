import figma from "@figma/code-connect/react";
import { Tabs } from "./tabs";

// NOTE: Skipped VARIANT "Direction" [horizontal, Vertical left, Vertical right] → no matching code prop "direction"
figma.connect(
  Tabs.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2804-13138",
  {
    props: {
      size: figma.enum("Size", { lg: "lg", md: "md", sm: "sm" }),
      children: figma.children("*"),
    },
    example: (props) => (
      <Tabs.Root size={props.size}>{props.children}</Tabs.Root>
    ),
  }
);
