import figma from "@figma/code-connect/react";
import { Dialog } from "./dialog";

figma.connect(
  Dialog.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5818-30486",
  {
    props: {
      children: figma.children("*"),
      width: figma.enum("Size", { sm: "sm", md: "md", lg: "lg" }),
    },
    example: (props) => (
      <Dialog.Root>
        <Dialog.Content width={props.width}>
          <Dialog.Header>
            Dialog Title
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>{props.children}</Dialog.Body>
          <Dialog.Footer>Footer actions</Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    ),
  }
);
