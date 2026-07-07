import figma from "@figma/code-connect/react";
import { ChatBubble } from "./chat-bubble";

// --- chat-bubble-container → ChatBubble.Root ---
//
// The Figma component exposes a `Sender` property (User | Agent) that maps onto
// the `sender` variant. The payload, actions and feedback are authored by the
// consumer, so the snippet forwards the Figma children into ChatBubble.Bubble
// and leaves the avatar/actions/feedback composition to the developer.
figma.connect(
  ChatBubble.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=10601-14469",
  {
    props: {
      children: figma.children("*"),
      sender: figma.enum("Sender", {
        User: "user",
        Agent: "agent",
      }),
    },
    example: (props) => (
      <ChatBubble.Root sender={props.sender}>
        <ChatBubble.Avatar />
        <ChatBubble.Bubble>{props.children}</ChatBubble.Bubble>
      </ChatBubble.Root>
    ),
  }
);
