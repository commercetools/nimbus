import figma from "@figma/code-connect/react";
import { Card } from "./card";
import type { CardProps } from "./card.types";

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
//
// The Figma Card component exposes two independent Yes/No variant
// properties (Outlined, Elevated) which map onto the kebab-case `variant`
// values. We read each property as a code-connect prop and assemble the
// variant name in the snippet by listing each enabled axis in the fixed
// order `outlined-elevated`. The muted variants have no Figma counterpart.
// Property names below match the labels designers use in the Figma
// component-property panel — adjust here if those labels are renamed.
figma.connect(
  Card.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=266-547",
  {
    props: {
      children: figma.children("*"),
      outlined: figma.enum("Outlined", { Yes: true, No: false }),
      elevated: figma.enum("Elevated", { Yes: true, No: false }),
    },
    example: (props) => (
      <Card.Root
        variant={
          ((
            [props.outlined && "outlined", props.elevated && "elevated"].filter(
              Boolean
            ) as string[]
          ).join("-") || "plain") as CardProps["variant"]
        }
      >
        {props.children}
      </Card.Root>
    ),
  }
);
