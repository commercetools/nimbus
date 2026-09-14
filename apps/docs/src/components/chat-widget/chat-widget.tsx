import { useState } from "react";
import { FloatingActionButton } from "@commercetools/nimbus";
import { Chat, Close } from "@commercetools/nimbus-icons";
import { ChatWidgetPanel } from "./chat-widget-panel";

/**
 * A floating "ask about your data" launcher, visible on every docs route —
 * mocks the chat half of a future support-chat feature that answers with a
 * resolvable nimbus-viz chart payload (see chat-widget-message.tsx). Dev-only:
 * gated behind `import.meta.env.DEV` where it's mounted (see app.tsx), so it
 * is structurally absent from the production docs build, not just inert.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingActionButton
        aria-label={isOpen ? "Close chat" : "Ask about your data"}
        position="fixed"
        bottom="800"
        right="800"
        onPress={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <Close /> : <Chat />}
      </FloatingActionButton>
      {isOpen ? <ChatWidgetPanel onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}
