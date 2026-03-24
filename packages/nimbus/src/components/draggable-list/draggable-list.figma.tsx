import figma from "@figma/code-connect/react";
import { DraggableList } from "./draggable-list";

figma.connect(
  DraggableList.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=8571-73936",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => (
      <DraggableList.Root>{props.children}</DraggableList.Root>
    ),
  }
);
