import figma from "@figma/code-connect/react";
import { Checkbox } from "./checkbox";

// Checkbox in Figma represents a group of options.
// Individual option visibility (Option 1-5) and Orientation are
// composition concerns — no direct code prop equivalent.
figma.connect(
  Checkbox,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=349-2690",
  {
    props: {
      children: figma.children("*"),
    },
    example: (props) => <Checkbox>{props.children}</Checkbox>,
  }
);
