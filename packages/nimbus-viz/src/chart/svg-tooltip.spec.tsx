import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { SvgTooltip } from "./svg-tooltip";
import { ChartThemeProvider } from "../theme";

function wrap(node: ReactNode) {
  return render(
    <ChartThemeProvider mode="light">
      <svg>{node}</svg>
    </ChartThemeProvider>
  );
}

describe("SvgTooltip", () => {
  it("renders a bold header and muted detail lines by default", () => {
    const { getByText } = wrap(
      <SvgTooltip x={10} innerWidth={300} lines={["Jan", "Orders: 120"]} />
    );
    expect(getByText("Jan")).toBeTruthy();
    expect(getByText("Orders: 120")).toBeTruthy();
  });

  it("renders custom content instead of lines when `content` is given", () => {
    const { getByTestId } = wrap(
      <SvgTooltip
        x={10}
        innerWidth={300}
        contentWidth={80}
        contentHeight={40}
        content={<text data-testid="custom">Rich</text>}
      />
    );
    expect(getByTestId("custom")).toBeTruthy();
  });

  it("plain string lines render with no swatch at all -- byte-identical to before this feature existed", () => {
    const { container } = wrap(
      <SvgTooltip x={10} innerWidth={300} lines={["Jan", "Orders: 120"]} />
    );
    expect(container.querySelector("circle")).toBeNull();
    expect(container.querySelectorAll("line")).toHaveLength(0);
  });

  it("a colored line defaults to a dot swatch matching its color", () => {
    const { container, getByText } = wrap(
      <SvgTooltip
        x={10}
        innerWidth={300}
        lines={["Jan", { text: "EU: 120", color: "#2a78d6" }]}
      />
    );
    const dot = container.querySelector("circle");
    expect(dot).not.toBeNull();
    expect(dot).toHaveAttribute("fill", "#2a78d6");
    expect(getByText("EU: 120")).toBeTruthy();
  });

  it("mixes a plain header with multiple colored lines, each its own swatch", () => {
    const { container } = wrap(
      <SvgTooltip
        x={10}
        innerWidth={300}
        lines={[
          "Jan",
          { text: "EU: 120", color: "#2a78d6" },
          { text: "US: 90", color: "#eb6834" },
        ]}
      />
    );
    const dots = container.querySelectorAll("circle");
    expect(dots).toHaveLength(2);
    expect(dots[0]).toHaveAttribute("fill", "#2a78d6");
    expect(dots[1]).toHaveAttribute("fill", "#eb6834");
  });

  it('an explicit "line" indicator renders a <line> swatch instead of a dot', () => {
    const { container } = wrap(
      <SvgTooltip
        x={10}
        innerWidth={300}
        lines={[{ text: "EU: 120", color: "#2a78d6", indicator: "line" }]}
      />
    );
    expect(container.querySelector("circle")).toBeNull();
    const line = container.querySelector("line");
    expect(line).not.toBeNull();
    expect(line).toHaveAttribute("stroke", "#2a78d6");
    expect(line).not.toHaveAttribute("stroke-dasharray");
  });

  it('a "dashed" indicator renders a dashed <line> swatch', () => {
    const { container } = wrap(
      <SvgTooltip
        x={10}
        innerWidth={300}
        lines={[{ text: "EU: 120", color: "#2a78d6", indicator: "dashed" }]}
      />
    );
    const line = container.querySelector("line");
    expect(line).not.toBeNull();
    expect(line?.getAttribute("stroke-dasharray")).not.toBe("");
  });
});
