import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useChartTheme } from "../theme";
import { EMPHASIS_PX, LABEL_PX } from "./typography";

/** Swatch shape for a colored tooltip line, matching shadcn's `ChartTooltipContent`
 *  `indicator` prop. Defaults to `"dot"`. */
export type SvgTooltipIndicator = "dot" | "line" | "dashed";

export interface SvgTooltipLine {
  text: string;
  /** Swatch color tying this row back to its mark/series — a chart's own
   *  entity color, not a fixed value. Omit for a plain, uncolored row (a
   *  header, a computed total with no single series behind it). */
  color?: string;
  /** Swatch shape. Only meaningful when `color` is set. Default `"dot"`. */
  indicator?: SvgTooltipIndicator;
}

export interface SvgTooltipProps {
  /** Anchor x in inner (plot) coordinates. */
  x: number;
  /** Plot width, used to flip the box so it never overflows the right edge. */
  innerWidth: number;
  /**
   * First entry is the bold header (ink); the rest are muted detail lines.
   * A plain `string` renders exactly as before (no swatch). Pass an
   * `SvgTooltipLine` instead for a row that should carry a small colored
   * swatch tying it back to its series/mark — the two forms can mix freely
   * in one array (e.g. a plain header followed by one colored line per
   * series).
   */
  lines?: (string | SvgTooltipLine)[];
  top?: number;
  /**
   * Custom SVG content rendered inside the box instead of `lines` — the escape
   * hatch for rich tooltips (color-coded multi-metric rows, formatted currency,
   * a "view orders" affordance). Positioned at the box's inner padding origin;
   * pass `contentWidth`/`contentHeight` so the box reserves the right size.
   */
  content?: ReactNode;
  contentWidth?: number;
  contentHeight?: number;
}

/** Horizontal padding inside the box (symmetric). */
const PAD_X = 12;
/** Baseline of the first line, from the box top (leaves room above the caps). */
const FIRST_BASELINE = 19;
/** Line-to-line advance — a comfortable ~1.3–1.5× the 12–14px text. */
const LINE_H = 19;
/** Space below the last line's baseline. */
const BOTTOM_PAD = 11;
/** Colored swatch diameter/length (dot radius doubled, or a line's length). */
const INDICATOR_SIZE = 8;
/** Gap between a colored line's swatch and its text. */
const INDICATOR_GAP = 6;

/** The title (first line) is a 14px bold header; detail lines are 12px. */
const sizeFor = (i: number) => (i === 0 ? EMPHASIS_PX : LABEL_PX);

/** A colored line reserves room for its swatch + a gap before the text
 *  starts; a plain line reserves none, so it renders exactly where it did
 *  before this existed. A pure, top-level function (not a closure over
 *  component state) so it needs no place in a hook's dependency array. */
const lineOffsetFor = (line: SvgTooltipLine | undefined): number =>
  line?.color ? INDICATOR_SIZE + INDICATOR_GAP : 0;

/**
 * A small SVG readout box, drawn inside the plot's coordinate system. Shared by
 * the hover interactions of the axis-based charts.
 *
 * The box width is the *measured* width of the widest line (via
 * `getComputedTextLength`), not a character-count estimate — so text of any
 * font size or glyph mix stays fully inside the box (SVG can't shrink-wrap a
 * `<rect>` to its text on its own). A proportional estimate seeds the first
 * paint, then a layout effect corrects it to the exact width before the browser
 * paints, so there's no visible reflow.
 */
export function SvgTooltip({
  x,
  innerWidth,
  lines = [],
  top = 4,
  content,
  contentWidth = 0,
  contentHeight = 0,
}: SvgTooltipProps) {
  const theme = useChartTheme();
  const refs = useRef<(SVGTextElement | null)[]>([]);
  refs.current.length = lines.length;

  const normalized = useMemo<SvgTooltipLine[]>(
    () => lines.map((l) => (typeof l === "string" ? { text: l } : l)),
    [lines]
  );

  // Proportional width estimate for the first paint / non-DOM environments.
  const estimate = useMemo(
    () =>
      Math.max(
        0,
        ...normalized.map(
          (l, i) => l.text.length * sizeFor(i) * 0.6 + lineOffsetFor(l)
        )
      ),
    [normalized]
  );
  const [textW, setTextW] = useState(estimate);

  useLayoutEffect(() => {
    let max = 0;
    normalized.forEach((line, i) => {
      const t = refs.current[i];
      if (t && typeof t.getComputedTextLength === "function") {
        max = Math.max(max, t.getComputedTextLength() + lineOffsetFor(line));
      }
    });
    setTextW(max || estimate);
  }, [normalized, estimate]);

  const contentMode = content != null;
  const boxW = contentMode
    ? contentWidth + PAD_X * 2
    : Math.ceil(textW) + PAD_X * 2;
  const boxH = contentMode
    ? contentHeight + PAD_X * 2
    : FIRST_BASELINE + LINE_H * (lines.length - 1) + BOTTOM_PAD;
  const left = x + 10 + boxW > innerWidth ? x - 10 - boxW : x + 10;

  return (
    <g
      pointerEvents="none"
      transform={`translate(${Math.max(0, left)}, ${top})`}
    >
      <rect
        width={boxW}
        height={boxH}
        rx={6}
        fill={theme.surface}
        stroke={theme.grid}
      />
      {contentMode ? (
        <g transform={`translate(${PAD_X}, ${PAD_X})`}>{content}</g>
      ) : (
        normalized.map((line, i) => {
          const baseline = FIRST_BASELINE + LINE_H * i;
          // Vertically center a swatch on the text, matching the
          // `dy="0.32em"` convention used elsewhere in this codebase to
          // center text at a point.
          const swatchY = baseline - sizeFor(i) * 0.32;
          const indicator = line.indicator ?? "dot";
          return (
            <g key={i}>
              {line.color &&
                (indicator === "dot" ? (
                  <circle
                    cx={PAD_X + INDICATOR_SIZE / 2}
                    cy={swatchY}
                    r={INDICATOR_SIZE / 2}
                    fill={line.color}
                  />
                ) : (
                  <line
                    x1={PAD_X}
                    x2={PAD_X + INDICATOR_SIZE}
                    y1={swatchY}
                    y2={swatchY}
                    stroke={line.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray={
                      indicator === "dashed" ? "2,1.5" : undefined
                    }
                  />
                ))}
              <text
                ref={(el) => {
                  refs.current[i] = el;
                }}
                x={PAD_X + lineOffsetFor(line)}
                y={baseline}
                // Sizes must be inline styles, not attributes: the host
                // reset (`* { font-size: inherit }`) beats SVG
                // presentation attributes.
                style={{
                  fontSize: sizeFor(i),
                  fontWeight: i === 0 ? 700 : 400,
                }}
                fill={i === 0 ? theme.ink : theme.mutedInk}
              >
                {line.text}
              </text>
            </g>
          );
        })
      )}
    </g>
  );
}
