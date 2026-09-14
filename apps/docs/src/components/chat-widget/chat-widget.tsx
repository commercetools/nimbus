import { useRef, useState } from "react";
import { FloatingActionButton } from "@commercetools/nimbus";
import { Chat } from "@commercetools/nimbus-icons";
import { ChatWidgetPanel } from "./chat-widget-panel";

/**
 * A collapsible "ask about your data" sidebar, visible on every docs route —
 * mocks the chat half of a future support-chat feature that answers with a
 * resolvable nimbus-viz chart payload (see chat-widget-message.tsx). Dev-only:
 * gated behind `import.meta.env.DEV` where it's mounted (see app.tsx), so it
 * is structurally absent from the production docs build, not just inert.
 *
 * The trigger button only renders while the sidebar is collapsed — once open,
 * the sidebar's own header carries the close control, so there's no floating
 * button left sitting on top of (or, on narrow viewports, past the edge of)
 * the docked sidebar.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setIsOpen(false);
    // Matches Drawer's own documented behavior: return focus to the trigger
    // when the panel closes rather than dropping it to <body>. The trigger
    // isn't mounted yet on this render (it only reappears once `isOpen`
    // flips), so wait a frame for it to commit before focusing it.
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      {!isOpen && (
        <FloatingActionButton
          ref={triggerRef}
          aria-label="Ask about your data"
          position="fixed"
          bottom="800"
          right="800"
          onPress={() => setIsOpen(true)}
        >
          <Chat />
        </FloatingActionButton>
      )}
      <ChatWidgetPanel isOpen={isOpen} onClose={close} />
    </>
  );
}
