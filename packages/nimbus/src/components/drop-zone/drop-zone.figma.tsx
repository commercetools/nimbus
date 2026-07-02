import figma from "@figma/code-connect/react";
import { DropZone } from "./drop-zone";

// TODO: update with real Figma node id — this is a placeholder until the
// DropZone component is added to the NIMBUS design system Figma file.
figma.connect(
  DropZone,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=0-0",
  {
    example: () => <DropZone />,
  }
);
