import {
  Box,
  ChatMessage,
  Markdown,
  useColorMode,
} from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";
import {
  ChartThemeProvider,
  ResponsiveContainer,
  ResolvedChart,
} from "@commercetools/nimbus-viz";
import type { ResolveRequest } from "@commercetools/nimbus-viz";
import type { ChatWidgetMessage as ChatWidgetMessageModel } from "./types";

/** Strips the wire contract's own `kind` discriminant and hands the rest
 * straight to nimbus-viz — this is the entire "agent hands off a resolvable
 * payload" integration point (packages/nimbus-viz/src/selection/resolved-chart.tsx). */
function toResolveRequest(
  chart: NonNullable<ChatWidgetMessageModel["chart"]>
): ResolveRequest {
  return {
    intent: chart.intent,
    data: chart.data,
    options: "options" in chart ? chart.options : undefined,
  };
}

export function ChatWidgetMessage({
  message,
}: {
  message: ChatWidgetMessageModel;
}) {
  const { colorMode } = useColorMode();
  const mode = colorMode === "dark" ? "dark" : "light";
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
            {message.chart ? (
              // Explicit width is required, not cosmetic: ChatMessage.Body is
              // `width: fit-content` with `alignItems: "flex-start"`
              // (chat-message.recipe.ts) — a flex item with no explicit width
              // there gets its OWN auto/fit-content size, and this box's only
              // content is a chain of `width: 100%` descendants (nimbus-viz's
              // ResponsiveContainer -> visx's ParentSize), whose intrinsic
              // content-width is 0. Without `width="full"` here, the whole
              // chain resolves to 0 and the chart silently renders nothing.
              <Box mt="200" width="full">
                <ChartThemeProvider mode={mode}>
                  <ResponsiveContainer height={220}>
                    {(width, height) => (
                      <ResolvedChart
                        request={toResolveRequest(message.chart!)}
                        width={width}
                        height={height}
                      />
                    )}
                  </ResponsiveContainer>
                </ChartThemeProvider>
              </Box>
            ) : null}
          </>
        )}
      </ChatMessage.Body>
    </ChatMessage.Root>
  );
}
