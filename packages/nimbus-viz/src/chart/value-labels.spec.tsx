import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ValueLabel } from "./value-labels";
import { ChartThemeProvider } from "../theme";

function wrap(node: React.ReactNode) {
  return render(
    <ChartThemeProvider mode="light">
      <svg>{node}</svg>
    </ChartThemeProvider>
  );
}

describe("ValueLabel", () => {
  it("renders the given text at the given position, centered via dy", () => {
    const { getByText } = wrap(<ValueLabel x={10} y={20} text="4.2k" />);
    const el = getByText("4.2k");
    expect(el).toHaveAttribute("x", "10");
    expect(el).toHaveAttribute("y", "20");
    expect(el).toHaveAttribute("dy", "0.32em");
  });

  it('defaults to "middle" anchor and the theme ink color', () => {
    const { getByText } = wrap(<ValueLabel x={0} y={0} text="120" />);
    const el = getByText("120");
    expect(el).toHaveAttribute("text-anchor", "middle");
    expect(el).toHaveAttribute("fill", "#0b0b0b"); // light theme's ink role
  });

  it("honors an explicit anchor and color", () => {
    const { getByText } = wrap(
      <ValueLabel x={0} y={0} text="90" anchor="end" color="#eb6834" />
    );
    const el = getByText("90");
    expect(el).toHaveAttribute("text-anchor", "end");
    expect(el).toHaveAttribute("fill", "#eb6834");
  });
});
