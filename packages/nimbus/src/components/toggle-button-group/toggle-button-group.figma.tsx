import figma from "@figma/code-connect/react";
import { ToggleButtonGroup } from "./toggle-button-group";

figma.connect(
  ToggleButtonGroup.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2693-2343",
  {
    props: {
      size: figma.enum("Size", {
        sm: "sm",
        md: "md",
      }),
      children: figma.children("*"),
    },
    example: (props) => (
      <ToggleButtonGroup.Root size={props.size}>
        {props.children}
      </ToggleButtonGroup.Root>
    ),
  }
);
