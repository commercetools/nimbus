import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useChartTheme } from "../theme";
import { EMPHASIS_PX, LABEL_PX } from "./typography";

export interface SvgTooltipProps {
  /** Anchor x in inner (plot) coordinates. */
  x: number;
  /** Plot width, used to flip the box so it never overflows the right edge. */
  innerWidth: number;
  /** First line is the bold header (ink); the rest are muted detail lines. */
  lines: string[];
  top?: number;
}

/** Horizontal padding inside the box (symmetric). */
const PAD_X = 12;
/** Baseline of the first line, from the box top (leaves room above the caps). */
const FIRST_BASELINE = 19;
/** Line-to-line advance — a comfortable ~1.3–1.5× the 12–14px text. */
const LINE_H = 19;
/** Space below the last line's baseline. */
const BOTTOM_PAD = 11;

/** The title (first line) is a 14px bold header; detail lines are 12px. */
const sizeFor = (i: number) => (i === 0 ? EMPHASIS_PX : LABEL_PX);

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
export function SvgTooltip({ x, innerWidth, lines, top = 4 }: SvgTooltipProps) {
  const theme = useChartTheme();
  const refs = useRef<(SVGTextElement | null)[]>([]);
  refs.current.length = lines.length;

  // Proportional width estimate for the first paint / non-DOM environments.
  const estimate = useMemo(
    () => Math.max(0, ...lines.map((l, i) => l.length * sizeFor(i) * 0.6)),
    [lines]
  );
  const [textW, setTextW] = useState(estimate);

  useLayoutEffect(() => {
    let max = 0;
    for (const t of refs.current) {
      if (t && typeof t.getComputedTextLength === "function") {
        max = Math.max(max, t.getComputedTextLength());
      }
    }
    setTextW(max || estimate);
  }, [lines, estimate]);

  const boxW = Math.ceil(textW) + PAD_X * 2;
  const boxH = FIRST_BASELINE + LINE_H * (lines.length - 1) + BOTTOM_PAD;
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
      {lines.map((line, i) => (
        <text
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          x={PAD_X}
          y={FIRST_BASELINE + LINE_H * i}
          // Sizes must be inline styles, not attributes: the host reset
          // (`* { font-size: inherit }`) beats SVG presentation attributes.
          style={{ fontSize: sizeFor(i), fontWeight: i === 0 ? 700 : 400 }}
          fill={i === 0 ? theme.ink : theme.mutedInk}
        >
          {line}
        </text>
      ))}
    </g>
  );
}
