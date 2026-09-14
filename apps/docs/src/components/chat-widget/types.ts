import type { ChatChartPayload } from "../../../vite-plugins/chat/contract";

export type ChatWidgetMessageStatus = "sending" | "done" | "error";

type SeriesChart = Extract<ChatChartPayload, { kind: "series" }>;
type NonSeriesChart = Exclude<ChatChartPayload, { kind: "series" }>;

/** Same as the wire's ChatChartPayload, but with each series point's `x`
 * revived from an ISO date string into a real Date — nimbus-viz's
 * SeriesPoint.x accepts `number | Date`
 * (packages/nimbus-viz/src/chart/types.ts). Produced by
 * use-chat-widget.ts's reviveChartDates(). */
export type ResolvedChatChart =
  | NonSeriesChart
  | (Omit<SeriesChart, "data"> & {
      data: Array<{
        id: string;
        label: string;
        data: Array<{ x: Date; y: number | null }>;
      }>;
    });

/** One transcript entry as the widget renders it — a superset of the wire
 * message shape (contract.ts's ChatWireMessage) with UI-only fields
 * (id/status/chart) the API response never carries directly. */
export interface ChatWidgetMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  chart?: ResolvedChatChart | null;
  status: ChatWidgetMessageStatus;
}
