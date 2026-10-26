import figma from "@figma/code-connect/react";
import { Accordion } from "./accordion";

// --- Accordion → Accordion.Root ---
//
// One Figma "Accordion" instance is one header + content pair, so the snippet
// wraps a single Accordion.Item. The nested ".Controls" instance (shown by the
// "Controls" boolean) is the slot for Accordion.HeaderRightContent.
figma.connect(
  Accordion.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=2609-4122",
  {
    props: {
      size: figma.enum("Size", { md: "md", sm: "sm" }),
      defaultExpanded: figma.enum("Expanded", { YES: true }),
      headline: figma.textContent("Headline"),
      headerRightContent: figma.boolean("Controls", {
        true: (
          <Accordion.HeaderRightContent>Controls</Accordion.HeaderRightContent>
        ),
        false: undefined,
      }),
    },
    example: (props) => (
      <Accordion.Root size={props.size}>
        <Accordion.Item defaultExpanded={props.defaultExpanded}>
          <Accordion.Header>
            {props.headline}
            {props.headerRightContent}
          </Accordion.Header>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    ),
  }
);
