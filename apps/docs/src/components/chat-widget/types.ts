import type { ChatChartPayload } from "../../../vite-plugins/chat/contract";

export type ChatWidgetMessageStatus = "sending" | "done" | "error";

type DateRevivedKind = "series" | "ohlc" | "timeline-events";
type PassthroughChart = Exclude<ChatChartPayload, { kind: DateRevivedKind }>;
type SeriesChart = Extract<ChatChartPayload, { kind: "series" }>;
type OhlcChart = Extract<ChatChartPayload, { kind: "ohlc" }>;
type TimelineChart = Extract<ChatChartPayload, { kind: "timeline-events" }>;

/** Same wire payload, with the three Date-bearing kinds' ISO strings revived
 * into real Dates — nimbus-viz's `SeriesPoint.x` / `OhlcBar.date` /
 * `TimelineEvent.start`/`end` all require an actual `Date` instance
 * (`GanttChart` calls `.getTime()` directly; `CandlestickChart` formats via
 * d3's `timeFormat`). `calendar` is deliberately NOT revived —
 * `CalendarHeatmap` normalizes `Date | string` internally
 * (`calendar-heatmap.tsx`), so a wire string is already correct there.
 * Produced by `use-chat-widget.ts`'s `reviveChartDates()`. */
export type ResolvedChatChart =
  | PassthroughChart
  | (Omit<SeriesChart, "data"> & {
      data: Array<{
        id: string;
        label: string;
        data: Array<{ x: Date; y: number | null }>;
      }>;
    })
  | (Omit<OhlcChart, "data"> & {
      data: Array<{
        date: Date;
        open: number;
        high: number;
        low: number;
        close: number;
      }>;
    })
  | (Omit<TimelineChart, "data"> & {
      data: Array<{
        label: string;
        start: Date;
        end?: Date;
        category?: string;
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
