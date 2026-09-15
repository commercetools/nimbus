import type { ReactNode } from "react";
import { Group } from "@visx/group";
import { useChartTheme } from "../theme";
import type { Margin } from "./types";
import { chartRootStyle } from "./typography";

export interface InnerDims {
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
}

export interface ChartFrameProps {
  width: number;
  height: number;
  margin?: Margin;
  /** Paint the themed surface behind the plot. */
  background?: boolean;
  /** Accessible label; the frame renders as role="img". */
  ariaLabel?: string;
  /**
   * Override the SVG's ARIA role. Default `"img"` -- correct for every
   * chart with no focusable descendants (all of them, today, except where
   * noted below). `"img"`'s ARIA definition treats its whole subtree as one
   * opaque graphic with no exposed children, so a chart that wires real
   * keyboard-focusable marks (roving tabindex -- see `bar-chart.tsx`) MUST
   * override this to `"graphics-document"`, the WAI-ARIA Graphics Module's
   * container role, which (unlike `"img"`) allows focusable descendants.
   * Leaving `"img"` while a mark is focusable is an axe `nested-interactive`
   * violation, caught by `addon-a11y`'s `test: "error"` mode.
   */
  role?: "img" | "graphics-document";
  /** Render-prop receiving the inner (margin-inset) plot dimensions. */
  children: (dims: InnerDims) => ReactNode;
}

const DEFAULT_MARGIN: Margin = { top: 12, right: 16, bottom: 28, left: 44 };

/**
 * The shared SVG shell: sizes the canvas, insets the plot by margins, and hands
 * children an inner coordinate system already translated into place. This is
 * the first piece of shared chart-chrome; axes/legend/tooltip compose around
 * it. (Assembly note: whether margins should be measured from axis tick widths
 * rather than fixed is an open question — see docs/09.)
 */
export function ChartFrame({
  width,
  height,
  margin = DEFAULT_MARGIN,
  background = false,
  ariaLabel,
  role = "img",
  children,
}: ChartFrameProps) {
  const theme = useChartTheme();
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  return (
    <svg
      width={width}
      height={height}
      role={role}
      aria-label={ariaLabel}
      style={chartRootStyle()}
    >
      {background && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={8}
          fill={theme.surface}
        />
      )}
      <Group left={margin.left} top={margin.top}>
        {children({ innerWidth, innerHeight, margin })}
      </Group>
    </svg>
  );
}
