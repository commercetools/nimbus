import type { ReactNode } from "react";
import { ParentSize } from "@visx/responsive";

export interface ResponsiveContainerProps {
  /** Fixed height in px. Width fills the parent and is observed. */
  height: number;
  children: (width: number, height: number) => ReactNode;
}

/**
 * Supplies a measured width (and the given height) to a chart, re-rendering on
 * resize. Renders nothing until a positive width is observed, so charts never
 * compute against a zero-width layout.
 */
export function ResponsiveContainer({
  height,
  children,
}: ResponsiveContainerProps) {
  return (
    <div style={{ width: "100%", height, overflowX: "hidden" }}>
      <ParentSize>
        {({ width }) => (width > 0 ? children(width, height) : null)}
      </ParentSize>
    </div>
  );
}
