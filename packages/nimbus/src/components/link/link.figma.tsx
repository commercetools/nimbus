import figma from "@figma/code-connect/react";
import { Link } from "./link";

figma.connect(
  Link,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=384-5671",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
      size: figma.enum("Font-size", {
        Default: "md",
        sm: "sm",
        xs: "xs",
      }),
    },
    example: (props) => (
      <Link size={props.size} isDisabled={props.isDisabled}>
        Link text
      </Link>
    ),
  }
);
