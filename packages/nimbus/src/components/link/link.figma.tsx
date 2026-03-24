import figma from "@figma/code-connect/react";
import { Link } from "./link";

// NOTE: Skipped VARIANT "Font-size" [Default, sm, xs] → no matching code prop "fontSize"
figma.connect(
  Link,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=384-5671",
  {
    example: () => <Link>{/* label placeholder */}</Link>,
  }
);
