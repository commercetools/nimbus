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
});
