import figma from "@figma/code-connect/react";
import { Drawer } from "./drawer";

// --- Unmatched Figma properties (manual review needed) ---
// Variant (VARIANT: Text) — composition, no code equivalent
// Size (VARIANT: sm, xs, md, lg, xl) — Drawer size is not exposed as a prop

figma.connect(
  Drawer.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=8334-32318",
  {
    props: {
      footer: figma.boolean("Footer#7819:9", {
        true: <Drawer.Footer>Footer content</Drawer.Footer>,
        false: undefined,
      }),
    },
    example: (props) => (
      <Drawer.Root>
        <Drawer.Body>
          Drawer content
          {props.footer}
        </Drawer.Body>
      </Drawer.Root>
    ),
  }
);
