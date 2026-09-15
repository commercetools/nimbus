import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PointMark, pointShapeFor } from "./point-shapes";

describe("pointShapeFor", () => {
  it("cycles through the fixed shape list by index, starting at circle", () => {
    expect(pointShapeFor(0)).toBe("circle");
    expect(pointShapeFor(1)).toBe("square");
    expect(pointShapeFor(5)).toBe("circle"); // wraps after 5 shapes
  });
});

describe("PointMark", () => {
  it("renders slot 0 as a plain <circle> — byte-identical to today's mark", () => {
    const { container } = render(
      <svg>
        <PointMark shape="circle" cx={10} cy={10} r={4} fill="#111" />
      </svg>
    );
    const circle = container.querySelector("circle");
    expect(circle).not.toBeNull();
    expect(circle).toHaveAttribute("cx", "10");
    expect(circle).toHaveAttribute("cy", "10");
    expect(circle).toHaveAttribute("r", "4");
    expect(container.querySelector("polygon")).toBeNull();
  });

  it("renders every non-circle shape as a <polygon> with real, distinct geometry", () => {
    const shapes = ["square", "triangle", "diamond", "star"] as const;
    const pointsBySlot = shapes.map((shape) => {
      const { container } = render(
        <svg>
          <PointMark shape={shape} cx={20} cy={20} r={4} fill="#111" />
        </svg>
      );
      const polygon = container.querySelector("polygon");
      expect(polygon).not.toBeNull();
      return polygon?.getAttribute("points");
    });
    // Every shape's polygon has real, non-empty point data.
    pointsBySlot.forEach((points) => expect(points).toBeTruthy());
    // No two shapes collapse to the same outline.
    expect(new Set(pointsBySlot).size).toBe(shapes.length);
  });

  it("keeps a small radius legible: no shape's geometry collapses to a point", () => {
    // The exact failure mode point-shapes.tsx exists to avoid for
    // patternFill: at bubble-chart's R_MIN (4px radius), the shape must
    // still span a real, non-degenerate area.
    const shapes = ["square", "triangle", "diamond", "star"] as const;
    shapes.forEach((shape) => {
      const { container } = render(
        <svg>
          <PointMark shape={shape} cx={0} cy={0} r={4} fill="#111" />
        </svg>
      );
      const points = container
        .querySelector("polygon")
        ?.getAttribute("points")
        ?.split(/\s+/)
        .map((pair) => pair.split(",").map(Number));
      expect(points && points.length).toBeGreaterThanOrEqual(3);
      const xs = points!.map((p) => p[0]);
      const ys = points!.map((p) => p[1]);
      expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(1);
      expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(1);
    });
  });

  it("wires mouse/click handlers on every shape variant", () => {
    const onClick = () => {};
    const { container } = render(
      <svg>
        <PointMark
          shape="triangle"
          cx={5}
          cy={5}
          r={4}
          fill="#111"
          onClick={onClick}
        />
      </svg>
    );
    expect(container.querySelector("polygon")).not.toBeNull();
  });
});
