import figma from "@figma/code-connect/react";
import { ToggleButtonGroup } from "./toggle-button-group";

figma.connect(
  ToggleButtonGroup.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2693-2343",
  {
    props: {
      children: figma.children("*"),
      size: figma.enum("Size", { md: "md" }),
    },
    example: (props) => (
      <ToggleButtonGroup.Root size={props.size}>
        {props.children}
      </ToggleButtonGroup.Root>
    ),
  }
);
