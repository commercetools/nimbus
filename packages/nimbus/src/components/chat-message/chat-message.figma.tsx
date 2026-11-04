import figma from "@figma/code-connect/react";
import { ChatMessage } from "./chat-message";

// --- chat-message → ChatMessage.Root ---
//
// The Figma component exposes `Sender` (User | Agent) and `Tone`
// (neutral | error), which map onto the `sender` and `tone` props. The
// message text, actions and feedback are authored by the consumer, so the
// snippet leaves the body content to the developer.
figma.connect(
  ChatMessage.Root,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=12563-79221",
  {
    props: {
      sender: figma.enum("Sender", {
        User: "user",
        Agent: "agent",
      }),
      // `neutral` is the default tone and needs no prop.
      tone: figma.enum("Tone", { error: "error" }),
    },
    example: (props) => (
      <ChatMessage.Root sender={props.sender} tone={props.tone}>
        <ChatMessage.Avatar />
        <ChatMessage.Body>Message content</ChatMessage.Body>
      </ChatMessage.Root>
    ),
  }
);
