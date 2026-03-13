import figma from "@figma/code-connect/react";
import { Dialog } from "./dialog";

// --- Unmatched Figma properties (manual review needed) ---
// Size (VARIANT: sm, md, lg) — not exposed as a prop on Dialog.Root
// Show image, → image, → Custom content — composition concerns, not Dialog.Root props

figma.connect(
  Dialog.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5818-30486",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <Dialog.Root>{props.children}</Dialog.Root>,
  }
);

// --- Variant-specific: Text dialog ---
figma.connect(
  Dialog.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5818-30486",
  {
    variant: { Variant: "Text" },
    example: () => (
      <Dialog.Root>
        <Dialog.Header>Dialog Title</Dialog.Header>
        <Dialog.Body>Dialog content goes here.</Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>Cancel</Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Root>
    ),
  }
);

// --- Variant-specific: Destructive dialog ---
figma.connect(
  Dialog.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5818-30486",
  {
    variant: { Variant: "Destructive" },
    example: () => (
      <Dialog.Root>
        <Dialog.Header>Confirm Deletion</Dialog.Header>
        <Dialog.Body>This action cannot be undone.</Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>Cancel</Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Root>
    ),
  }
);
