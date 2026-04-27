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
// The Figma Card component exposes three independent visual properties
// (Outlined, Elevated, Background) which map onto the eight kebab-case
// `variant` values. We read each property as a code-connect prop and
// assemble the variant name in the snippet by listing each enabled axis
// in the fixed order `outlined-elevated-muted`. Property names below
// match the labels designers use in the Figma component-property panel
// — adjust here if those labels are renamed.
figma.connect(
  Card.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=266-547",
  {
    props: {
      children: figma.children("*"),
      outlined: figma.boolean("Outlined"),
      elevated: figma.boolean("Elevated"),
      muted: figma.enum("Background", {
        Default: false,
        Muted: true,
      }),
    },
    example: (props) => (
      <Card.Root
        variant={
          ((
            [
              props.outlined && "outlined",
              props.elevated && "elevated",
              props.muted && "muted",
            ].filter(Boolean) as string[]
          ).join("-") || "plain") as CardProps["variant"]
        }
      >
        {props.children}
      </Card.Root>
    ),
  }
);
