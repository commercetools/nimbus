import figma from "@figma/code-connect/react";
import { Checkbox } from "./checkbox";

// NOTE: Skipped VARIANT "Validation" [none, Invalid, Validation3] → no matching code prop "validation"
figma.connect(
  Checkbox,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=265-329",
  {
    example: () => <Checkbox>{/* label placeholder */}</Checkbox>,
  }
);
