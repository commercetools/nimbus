import figma from "@figma/code-connect/react";
import { Avatar } from "./avatar";

// NOTE: Skipped VARIANT "Style" [Image, initials] → no matching code prop "style"
figma.connect(
  Avatar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=180-1106",
  {
    props: {
      size: figma.enum("Size", { xs: "xs", "2xs": "2xs", md: "md" }),
    },
    example: (props) => <Avatar firstName="" lastName="" size={props.size} />,
  }
);
