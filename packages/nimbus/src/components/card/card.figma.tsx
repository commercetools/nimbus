import figma from "@figma/code-connect/react";
import { Card } from "./card";

// --- Card content → Card.Body ---
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
    },
    example: (props) => (
      <>
        {props.leadingElement}
        {props.header}
        <Card.Body>{props.children}</Card.Body>
      </>
    ),
  }
);

// --- Card → Card.Root ---
//
// The Figma Card component exposes two independent Yes/No variant
// properties (Outlined, Elevated). Code Connect does not run code in the
// example, so each of the four combinations gets its own connect with a
// fixed kebab-case `variant` value. The muted variants have no Figma
// counterpart. Property names below match the labels designers use in the
// Figma component-property panel — adjust here if those labels are renamed.
const CARD_URL =
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=266-547";

figma.connect(Card.Root, CARD_URL, {
  variant: { Outlined: "No", Elevated: "No" },
  props: { children: figma.children("*") },
  example: (props) => <Card.Root variant="plain">{props.children}</Card.Root>,
});

figma.connect(Card.Root, CARD_URL, {
  variant: { Outlined: "Yes", Elevated: "No" },
  props: { children: figma.children("*") },
  example: (props) => (
    <Card.Root variant="outlined">{props.children}</Card.Root>
  ),
});

figma.connect(Card.Root, CARD_URL, {
  variant: { Outlined: "No", Elevated: "Yes" },
  props: { children: figma.children("*") },
  example: (props) => (
    <Card.Root variant="elevated">{props.children}</Card.Root>
  ),
});

figma.connect(Card.Root, CARD_URL, {
  variant: { Outlined: "Yes", Elevated: "Yes" },
  props: { children: figma.children("*") },
  example: (props) => (
    <Card.Root variant="outlined-elevated">{props.children}</Card.Root>
  ),
});
