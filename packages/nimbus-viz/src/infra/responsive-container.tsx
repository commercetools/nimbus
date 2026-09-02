import type { CSSProperties, ReactNode } from "react";
import { ParentSize } from "@visx/responsive";

export interface ResponsiveContainerProps {
  /** Fixed height in px. Ignored when `aspectRatio` is set. Defaults to 260. */
  height?: number;
  /**
   * width ÷ height ratio. When set, height follows the measured width (via CSS
   * `aspect-ratio`, so layout reserves the space), clamped by min/maxHeight.
   */
  aspectRatio?: number;
  /** Clamp for the derived height in `aspectRatio` mode. */
  minHeight?: number;
  maxHeight?: number;
  children: (width: number, height: number) => ReactNode;
}

/**
 * Supplies a measured width (and a height — fixed, or derived from an aspect
 * ratio) to a chart, re-rendering on resize. Renders nothing until a positive
 * size is observed, so charts never compute against a zero-size layout.
 */
export function ResponsiveContainer({
  height,
  aspectRatio,
  minHeight = 160,
  maxHeight = 520,
  children,
}: ResponsiveContainerProps) {
  if (aspectRatio) {
    const style: CSSProperties = {
      width: "100%",
      aspectRatio: `${aspectRatio}`,
      minHeight,
      maxHeight,
      overflow: "hidden",
    };
    return (
      <div style={style}>
        <ParentSize>
          {({ width, height: h }) =>
            width > 0 && h > 0 ? children(width, h) : null
          }
        </ParentSize>
      </div>
    );
  }
  const h = height ?? 260;
  return (
    <div style={{ width: "100%", height: h, overflowX: "hidden" }}>
      <ParentSize>
        {({ width }) => (width > 0 ? children(width, h) : null)}
      </ParentSize>
    </div>
  );
}
