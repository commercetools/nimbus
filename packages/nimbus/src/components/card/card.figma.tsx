import figma from "@figma/code-connect/react";
import { Card } from "./card";

// --- Card content → Card.Content ---
// NOTE: Skipped INSTANCE_SWAP "Leading element" → no matching code prop "leadingElement"
// NOTE: Skipped INSTANCE_SWAP "image" → no matching code prop "image"
figma.connect(
  Card.Content,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=266-482",
  {
    props: {
      children: figma.children("*"),
      header: figma.enum("Content type", {
        "Title + text": <Card.Header>Card Title</Card.Header>,
        "Leading element + text": <Card.Header>Card Title</Card.Header>,
      }),
      leadingElement: figma.enum("Content type", {
        "Leading element + text": figma.instance("Leading element"),
      }),
      instance: figma.instance("→ Instance"),
    },
    example: (props) => (
      <>
        {props.leadingElement}
        {props.header}
        <Card.Content>
          {props.instance}
          {props.children}
        </Card.Content>
      </>
    ),
  }
);

// --- Card → Card.Root ---
figma.connect(
  Card.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=266-547",
  {
    props: {
      children: figma.children("*"),
      borderStyle: figma.enum("Outlined", { Yes: "outlined", No: "none" }),
      elevation: figma.enum("Elevated", { Yes: "elevated", No: "none" }),
    },
    example: (props) => (
      <Card.Root borderStyle={props.borderStyle} elevation={props.elevation}>
        {props.children}
      </Card.Root>
    ),
  }
);
