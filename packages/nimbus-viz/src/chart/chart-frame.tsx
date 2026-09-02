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
  children,
}: ChartFrameProps) {
  const theme = useChartTheme();
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  return (
    <svg
      width={width}
      height={height}
      role="img"
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
