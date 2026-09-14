import { ChatMessage, Markdown } from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";
import { ChatWidgetChart } from "./chat-widget-chart";
import type { ChatWidgetMessage as ChatWidgetMessageModel } from "./types";

export function ChatWidgetMessage({
  message,
}: {
  message: ChatWidgetMessageModel;
}) {
  const sender = message.role === "user" ? "user" : "agent";
  const isError = message.status === "error";

  return (
    <ChatMessage.Root
      sender={sender}
      tone={isError ? "error" : undefined}
      isStreaming={message.status === "sending"}
    >
      <ChatMessage.Avatar>
        {sender === "agent" ? <AutoAwesome /> : undefined}
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        {message.status === "sending" ? (
          <ChatMessage.Typing>Assistant is typing…</ChatMessage.Typing>
        ) : (
          <>
            <Markdown>{message.text}</Markdown>
            {message.chart ? <ChatWidgetChart chart={message.chart} /> : null}
          </>
        )}
      </ChatMessage.Body>
    </ChatMessage.Root>
  );
}
