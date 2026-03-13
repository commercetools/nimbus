import figma from "@figma/code-connect/react";
import { Steps } from "./steps";

figma.connect(
  Steps.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=7381-65256",
  {
    props: {
      size: figma.enum("Size", {
        xs: "xs",
        sm: "sm",
        md: "md",
      }),
      children: figma.children("*"),
    },
    example: (props) => (
      <Steps.Root size={props.size} count={3}>
        {props.children}
      </Steps.Root>
    ),
  }
);
