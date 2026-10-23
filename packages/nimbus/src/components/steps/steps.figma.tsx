import figma from "@figma/code-connect/react";
import { Steps } from "./steps";

figma.connect(
  Steps.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=7381-65271",
  {
    props: {
      size: figma.enum("size", { xs: "xs", sm: "sm", md: "md" }),
      orientation: figma.enum("orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),
      children: figma.children("*"),
    },
    example: (props) => (
      <Steps.Root count={0} size={props.size}>
        {props.children}
      </Steps.Root>
    ),
  }
);
