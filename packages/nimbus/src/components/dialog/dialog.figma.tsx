import figma from "@figma/code-connect/react";
import { Dialog } from "./dialog";

// --- Unmatched Figma properties (manual review needed) ---
// Variant (VARIANT: Text, Destructive, Form, Custom content) — composition, no code equivalent
// Size (VARIANT: sm, md, lg) — not exposed as a prop on Dialog.Root
// Show image, → image, → Custom content — composition concerns, not Dialog.Root props

figma.connect(
  Dialog.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=5818-30486",
  {
    example: () => <Dialog.Root />,
  }
);
