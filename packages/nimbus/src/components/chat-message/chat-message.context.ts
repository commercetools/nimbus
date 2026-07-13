import { createContext, useContext } from "react";

/** Which participant sent the message. */
export type ChatMessageSender = "user" | "agent";

export interface ChatMessageContextValue {
  /** The resolved `sender` published by `ChatMessage.Root` (default `"agent"`). */
  sender: ChatMessageSender;
}

/**
 * Carries the message's `sender` from `ChatMessage.Root` to its parts, so a part
 * can derive a `sender`-dependent default that CSS alone can't express (e.g. the
 * avatar's `variant`). Defaults to `"agent"` to match the recipe when a part is
 * rendered without a `Root` (it never should be in practice).
 */
export const ChatMessageContext = createContext<ChatMessageContextValue>({
  sender: "agent",
});

export const useChatMessageContext = () => useContext(ChatMessageContext);
