import figma from "@figma/code-connect/react";
import { Chat as ChatIcon } from "@commercetools/nimbus-icons";
import { FloatingActionButton } from "./floating-action-button";

figma.connect(
  FloatingActionButton,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=11090-7295",
  {
    props: {
      isDisabled: figma.enum("State", { Disabled: true }),
    },
    example: (props) => (
      <FloatingActionButton aria-label="Action" isDisabled={props.isDisabled}>
        <ChatIcon />
      </FloatingActionButton>
    ),
  }
);
