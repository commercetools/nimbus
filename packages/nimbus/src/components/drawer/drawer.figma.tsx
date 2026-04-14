import figma from "@figma/code-connect/react";
import { Drawer } from "./drawer";

figma.connect(
  Drawer.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=8334-32318",
  {
    props: {
      children: figma.children("*"),
      width: figma.enum("Size", {
        xs: "xs",
        sm: "sm",
        md: "md",
        lg: "lg",
        xl: "xl",
      }),
      footer: figma.boolean("Footer", {
        true: <Drawer.Footer>Footer content</Drawer.Footer>,
        false: undefined,
      }),
    },
    example: (props) => (
      <Drawer.Root>
        <Drawer.Trigger>Open Drawer</Drawer.Trigger>
        <Drawer.Content width={props.width}>
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>{props.children}</Drawer.Body>
          {props.footer}
        </Drawer.Content>
      </Drawer.Root>
    ),
  }
);
