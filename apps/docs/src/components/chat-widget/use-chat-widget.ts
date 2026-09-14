import { useCallback, useState } from "react";
import type {
  ChatApiRequest,
  ChatApiResponse,
  ChatApiError,
  ChatWireMessage,
} from "../../../vite-plugins/chat/contract";
import type { ChatWidgetMessage, ResolvedChatChart } from "./types";

let nextId = 0;
const newId = () => `chat-widget-msg-${(nextId += 1)}`;

/** Revives the ISO date strings that only 3 of the 24 wire shapes carry —
 * `series` (SeriesPoint.x), `ohlc` (OhlcBar.date), and `timeline-events`
 * (TimelineEvent.start/end) — into real Dates, which is what nimbus-viz's own
 * components require (GanttChart calls `.getTime()` directly; CandlestickChart
 * formats via d3's timeFormat). `calendar`'s CalendarDatum.date is `Date |
 * string` and normalized internally by CalendarHeatmap, so it's deliberately
 * left as a wire string — not an oversight. Every other kind passes through
 * unchanged. */
function reviveChartDates(
  chart: ChatApiResponse["chart"]
): ResolvedChatChart | null {
  if (!chart) return null;
  switch (chart.kind) {
    case "series":
      return {
        ...chart,
        data: chart.data.map((series) => ({
          ...series,
          data: series.data.map((point) => ({
            ...point,
            x: new Date(point.x),
          })),
        })),
      };
    case "ohlc":
      return {
        ...chart,
        data: chart.data.map((bar) => ({ ...bar, date: new Date(bar.date) })),
      };
    case "timeline-events":
      return {
        ...chart,
        data: chart.data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
        })),
      };
    default:
      return chart;
  }
}

/** Conversation state + the call to the dev-only /api/chat endpoint. No
 * persistence — refreshing the page clears the conversation, which is fine
 * for this mock/demo (scope decision, not an oversight). */
export function useChatWidget() {
  const [messages, setMessages] = useState<ChatWidgetMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatWidgetMessage = {
        id: newId(),
        role: "user",
        text: trimmed,
        status: "done",
      };
      const placeholder: ChatWidgetMessage = {
        id: newId(),
        role: "assistant",
        text: "",
        status: "sending",
      };

      setMessages((prev) => [...prev, userMessage, placeholder]);
      setIsSending(true);

      // The Messages API is stateless — replay only the natural-language text
      // of each prior turn, never a previously-attached chart payload.
      const history: ChatWireMessage[] = [...messages, userMessage].map(
        (m) => ({ role: m.role, text: m.text })
      );

      try {
        const requestBody: ChatApiRequest = { messages: history };
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorBody = (await res
            .json()
            .catch(() => null)) as ChatApiError | null;
          throw new Error(errorBody?.error ?? `Request failed (${res.status})`);
        }

        const data = (await res.json()) as ChatApiResponse;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id
              ? {
                  ...m,
                  text: data.reply,
                  chart: reviveChartDates(data.chart),
                  status: "done",
                }
              : m
          )
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id
              ? { ...m, text: message, status: "error" }
              : m
          )
        );
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending]
  );

  return { messages, isSending, sendMessage };
}
