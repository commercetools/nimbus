import figma from "@figma/code-connect/react";
import { Accordion } from "./accordion";

figma.connect(
  Accordion.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2609-4404",
  {
    props: {
      size: figma.enum("Size", {
        md: "md",
        xs: "xs",
      }),
      children: figma.children("*"),
    },
    example: (props) => (
      <Accordion.Root size={props.size}>{props.children}</Accordion.Root>
    ),
  }
);
