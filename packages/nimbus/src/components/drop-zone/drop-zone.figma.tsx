import figma from "@figma/code-connect/react";
import { DropZone } from "./drop-zone";

// NOTE: Skipped State "dropTarget" → no mapping in STATE_BOOLEAN_MAP
// NOTE: Skipped State "focusWithin" → no mapping in STATE_BOOLEAN_MAP
figma.connect(
  DropZone,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=12940-63867",
  {
    props: {
      isDisabled: figma.enum("state", { disabled: true }),
    },
    example: (props) => <DropZone isDisabled={props.isDisabled} />,
  }
);
