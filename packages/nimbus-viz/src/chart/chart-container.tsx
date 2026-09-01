import { useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ChartFrame } from "./chart-frame";
import type { InnerDims } from "./chart-frame";
import { Legend } from "./legend";
import type { LegendItem } from "./legend";
import { DataTable } from "../components/data-table";
import { useChartTheme } from "../theme";
import { EMPHASIS_PX, LABEL_PX } from "./typography";
import { LEGEND_HEIGHT } from "./marks";
import type { Margin } from "./types";

const TITLE_H = 22;
const SUBTITLE_H = 18;
const CAPTION_H = 18;

// Off-screen but in the accessibility tree — the non-visual data equivalent.
const VISUALLY_HIDDEN: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export interface ChartContainerProps {
  width: number;
  height: number;
  /** Visible heading; renders inside the `<figcaption>`. */
  title?: ReactNode;
  /** Secondary heading line under the title. */
  subtitle?: ReactNode;
  /** Footnote below the plot (source, unit, etc.). */
  caption?: ReactNode;
  /** Categorical legend items — renders the shared `Legend` in a reserved strip. */
  legend?: LegendItem[];
  /** A custom legend node (e.g. a low→high gradient ramp) instead of `legend`. */
  legendSlot?: ReactNode;
  /** Override the reserved legend strip height (e.g. gradient legends use 24). */
  legendHeight?: number;
  /** Render the themed empty state instead of the plot. */
  isEmpty?: boolean;
  emptyMessage?: string;
  /** Accessible label for the SVG frame. */
  ariaLabel?: string;
  background?: boolean;
  margin?: Margin;
  /**
   * Non-visual data equivalent (WCAG 1.1.1). When provided, a visually-hidden
   * `DataTable` is exposed to assistive tech alongside the drawn chart, so a
   * screen-reader user gets the actual values — not just the SVG's one-line
   * `aria-label`. `columns`/`rows` follow the `DataTable` contract; `summary` is
   * an optional one-line gloss read before the table.
   */
  table?: { columns: string[]; rows: (string | number)[][]; summary?: string };
  /** Render a loading skeleton instead of the plot (takes precedence over data). */
  loading?: boolean;
  /** Render an error surface instead of the plot (highest precedence). */
  error?: ReactNode;
  /** Plot content, given the margin-inset dimensions (after title/legend reservations). */
  children: (dims: InnerDims) => ReactNode;
}

/**
 * The shared chart shell: one owner of the outer box, the optional visible
 * title/subtitle/caption (`<figure>`/`<figcaption>`), the legend strip (with a
 * single canonical reserved height), and the empty state — replacing the wrapper
 * `<div>` + `height − legendHeight` math that was hand-rolled and drifting across
 * ~22 charts. Wraps the minimal render-prop `ChartFrame`, so charts still draw
 * into margin-inset plot dimensions.
 */
export function ChartContainer({
  width,
  height,
  title,
  subtitle,
  caption,
  legend,
  legendSlot,
  legendHeight,
  isEmpty = false,
  emptyMessage = "No data",
  loading = false,
  error,
  ariaLabel,
  background,
  margin,
  table,
  children,
}: ChartContainerProps) {
  const theme = useChartTheme();
  const tableId = useId();
  const [tableOpen, setTableOpen] = useState(false);
  const [toggleFocused, setToggleFocused] = useState(false);
  const hasLegend = (legend != null && legend.length > 0) || legendSlot != null;
  const legendH = hasLegend ? (legendHeight ?? LEGEND_HEIGHT) : 0;
  const headH = (title ? TITLE_H : 0) + (subtitle ? SUBTITLE_H : 0);
  const footH = caption ? CAPTION_H : 0;
  const plotHeight = Math.max(0, height - legendH - headH - footH);
  const statusStyle: CSSProperties = {
    height: plotHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.mutedInk,
    fontSize: LABEL_PX,
  };

  return (
    <figure
      style={{
        width,
        height,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {(title || subtitle) && (
        <figcaption style={{ padding: 0 }}>
          {title && (
            <div
              style={{
                fontSize: EMPHASIS_PX,
                fontWeight: 700,
                color: theme.ink,
                lineHeight: `${TITLE_H}px`,
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: LABEL_PX,
                color: theme.mutedInk,
                lineHeight: `${SUBTITLE_H}px`,
              }}
            >
              {subtitle}
            </div>
          )}
        </figcaption>
      )}

      {error != null ? (
        <div role="alert" style={statusStyle}>
          {error}
        </div>
      ) : loading ? (
        <div role="status" aria-label="Loading chart" style={statusStyle}>
          <div
            style={{
              width: "55%",
              height: 8,
              borderRadius: 4,
              background: theme.grid,
            }}
          />
        </div>
      ) : isEmpty ? (
        <div role="note" style={statusStyle}>
          {emptyMessage}
        </div>
      ) : (
        <ChartFrame
          width={width}
          height={plotHeight}
          margin={margin}
          background={background}
          ariaLabel={ariaLabel}
        >
          {children}
        </ChartFrame>
      )}

      {hasLegend && (
        <div
          style={{ height: legendH, paddingTop: 6, boxSizing: "border-box" }}
        >
          {legendSlot ?? (legend ? <Legend items={legend} /> : null)}
        </div>
      )}

      {caption && (
        <div
          style={{
            fontSize: LABEL_PX,
            color: theme.mutedInk,
            lineHeight: `${CAPTION_H}px`,
          }}
        >
          {caption}
        </div>
      )}

      {table && !isEmpty && !loading && error == null && (
        <>
          {/* Skip-link-style keyboard affordance: visually hidden until focused
              (zero visual change to the chart), reveals the data table in place.
              Gives keyboard-only users an operable path to the underlying data;
              the table stays in the a11y tree for screen readers when closed. */}
          <button
            type="button"
            aria-expanded={tableOpen}
            aria-controls={tableId}
            onClick={() => setTableOpen((o) => !o)}
            onFocus={() => setToggleFocused(true)}
            onBlur={() => setToggleFocused(false)}
            style={
              toggleFocused
                ? {
                    position: "absolute",
                    top: 4,
                    left: 4,
                    zIndex: 3,
                    fontFamily: "inherit",
                    fontSize: LABEL_PX,
                    padding: "2px 8px",
                    color: theme.ink,
                    background: theme.surface,
                    border: `1px solid ${theme.axis}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    outline: `2px solid ${theme.accent}`,
                    outlineOffset: 2,
                  }
                : VISUALLY_HIDDEN
            }
          >
            {tableOpen ? "Hide data table" : "View data as table"}
          </button>
          <div
            id={tableId}
            role="region"
            aria-label="Data table"
            style={
              tableOpen
                ? {
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    overflow: "auto",
                    padding: 8,
                    boxSizing: "border-box",
                    background: theme.surface,
                    border: `1px solid ${theme.grid}`,
                    borderRadius: 4,
                  }
                : VISUALLY_HIDDEN
            }
          >
            {table.summary && <p>{table.summary}</p>}
            <DataTable
              columns={table.columns}
              rows={table.rows}
              caption={typeof title === "string" ? title : undefined}
            />
          </div>
        </>
      )}
    </figure>
  );
}
