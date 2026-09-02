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
    // "z" is a 4th distinct entity over a 3-color palette → overflow + one warn.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const scale = createColorScale(["a", "b", "c"], CATS);
    const before = { a: scale("a"), b: scale("b"), c: scale("c") };
    const z = scale("z"); // first sighting → appended
    expect(scale("a")).toBe(before.a);
    expect(scale("b")).toBe(before.b);
    expect(scale("c")).toBe(before.c);
    // stable on re-query
    expect(scale("z")).toBe(z);
    warn.mockRestore();
  });

  it("is deterministic: same domain → same entity→color mapping", () => {
    const a = createColorScale(["x", "y", "z"], CATS);
    const b = createColorScale(["x", "y", "z"], CATS);
    for (const k of ["x", "y", "z"]) expect(a(k)).toBe(b(k));
  });

  it("does not cycle past the palette: extra entities get a neutral, not a repeated hue", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const scale = createColorScale(["a", "b", "c", "d"], CATS);
    // the first three keep their distinct hues in order…
    expect(scale("a")).toBe("#111111");
    expect(scale("b")).toBe("#222222");
    expect(scale("c")).toBe("#333333");
    // …the 4th must NOT wrap back to the 1st hue (the old `i % 3` bug)
    expect(scale("d")).not.toBe("#111111");
    expect(warn).toHaveBeenCalledTimes(1); // warns once when the palette is exhausted
    warn.mockRestore();
  });

  it("uses the provided overflow color for entities past the palette", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const scale = createColorScale(["a", "b", "c", "d", "e"], CATS, {
      overflow: "#999999",
    });
    expect(scale("d")).toBe("#999999");
    expect(scale("e")).toBe("#999999"); // stable neutral, still not cycling
    warn.mockRestore();
  });

  it("calls onOverflow once with the palette size when exceeded", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onOverflow = vi.fn();
    createColorScale(["a", "b", "c", "d", "e"], CATS, { onOverflow });
    expect(onOverflow).toHaveBeenCalledTimes(1);
    expect(onOverflow).toHaveBeenCalledWith(3);
    warn.mockRestore();
  });
});

/** Reads the theme and exposes a couple of fields as data-attributes. */
function Probe() {
  const t = useChartTheme();
  return <span data-c0={t.categorical[0]} />;
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
    // The dark categorical[0] proves the dark role set was resolved.
    expect(span?.getAttribute("data-c0")).toBe("#3987e5"); // dark blue slot
  });

  it("defaults to the nimbus theme in light mode", () => {
    const { container } = render(
      <ChartThemeProvider>
        <Probe />
      </ChartThemeProvider>
    );
    const span = container.querySelector("span");
    // The light categorical[0] proves the light role set was resolved.
    expect(span?.getAttribute("data-c0")).toBe("#2a78d6"); // light blue slot
  });
});
