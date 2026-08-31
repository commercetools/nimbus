import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { createColorScale } from "./color-scale";
import { ChartThemeProvider, useChartTheme } from "./theme-provider";

const CATS = ["#111111", "#222222", "#333333"];

describe("createColorScale", () => {
  it("assigns colors in fixed order over the domain", () => {
    const scale = createColorScale(["a", "b", "c"], CATS);
    expect(scale("a")).toBe("#111111");
    expect(scale("b")).toBe("#222222");
    expect(scale("c")).toBe("#333333");
    expect(scale.domain).toEqual(["a", "b", "c"]);
  });

  it("appends an out-of-domain key without repainting existing entities", () => {
    const scale = createColorScale(["a", "b", "c"], CATS);
    const before = { a: scale("a"), b: scale("b"), c: scale("c") };
    const z = scale("z"); // first sighting → appended
    expect(scale("a")).toBe(before.a);
    expect(scale("b")).toBe(before.b);
    expect(scale("c")).toBe(before.c);
    // stable on re-query
    expect(scale("z")).toBe(z);
  });

  it("is deterministic: same domain → same entity→color mapping", () => {
    const a = createColorScale(["x", "y", "z"], CATS);
    const b = createColorScale(["x", "y", "z"], CATS);
    for (const k of ["x", "y", "z"]) expect(a(k)).toBe(b(k));
  });

  it("cycles through the ramp when the domain exceeds the color count", () => {
    const scale = createColorScale(["a", "b", "c", "d"], CATS);
    expect(scale("d")).toBe("#111111"); // wraps: index 3 % 3
  });
});

/** Reads the theme and exposes a couple of fields as data-attributes. */
function Probe() {
  const t = useChartTheme();
  return <span data-mode={t.mode} data-c0={t.categorical[0]} />;
}

describe("ChartThemeProvider / useChartTheme", () => {
  it("throws when used outside a provider", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/ChartThemeProvider/);
    err.mockRestore();
  });

  it("resolves the requested mode", () => {
    const { container } = render(
      <ChartThemeProvider mode="dark">
        <Probe />
      </ChartThemeProvider>
    );
    const span = container.querySelector("span");
    expect(span?.getAttribute("data-mode")).toBe("dark");
    expect(span?.getAttribute("data-c0")).toBe("#3987e5"); // dark blue slot
  });

  it("defaults to the nimbus theme in light mode", () => {
    const { container } = render(
      <ChartThemeProvider>
        <Probe />
      </ChartThemeProvider>
    );
    const span = container.querySelector("span");
    expect(span?.getAttribute("data-mode")).toBe("light");
    expect(span?.getAttribute("data-c0")).toBe("#2a78d6"); // light blue slot
  });
});
