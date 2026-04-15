import figma from "@figma/code-connect/react";
import { Card } from "./card";

// --- Card content → Card.Body ---
// NOTE: Skipped INSTANCE_SWAP "image" → no matching code prop "image"
figma.connect(
  Card.Body,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=266-482",
  {
    props: {
      children: figma.children("*"),
      header: figma.enum("Content type", {
        "Title + text": <Card.Header>Card Title</Card.Header>,
        "Leading element + text": <Card.Header>Card Title</Card.Header>,
      }),
      leadingElement: figma.instance("Leading element"),
      instance: figma.instance("→ Instance"),
    },
    example: (props) => (
      <>
        {props.leadingElement}
        {props.header}
        <Card.Body>
          {props.instance}
          {props.children}
        </Card.Body>
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
      variant: figma.enum("Elevated", {
        Yes: "elevated" as const,
        No: "outlined" as const,
      }),
    },
    example: (props) => (
      <Card.Root variant={props.variant}>{props.children}</Card.Root>
    ),
  }
);
