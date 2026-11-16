import { useLayoutEffect } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMeterDevWarnings } from "./use-meter-dev-warnings";

const options = {
  isSegmented: true,
  hasSegmentsToShow: true,
  hasOverflow: false,
  hasNegative: false,
  minValue: 0,
  maxValue: 100,
};

/** Renders the hook with a legend that registers itself, like Meter.Legend */
const renderWithLegend = (initialProps: typeof options) =>
  renderHook(
    (props: typeof options) => {
      const result = useMeterDevWarnings(props);
      useLayoutEffect(() => result.registerLegend(), [result]);
      return result;
    },
    { initialProps }
  );

describe("useMeterDevWarnings", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("warns once when the segments exceed the range, also when values change", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderWithLegend({ ...options, hasOverflow: true });
    rerender({ ...options, hasOverflow: true, maxValue: 200 });

    const messages = warn.mock.calls.map(([message]) => String(message));
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("exceeds the range (0 to 100)");
  });

  it("warns once about negative segment values", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderWithLegend({ ...options, hasNegative: true });
    rerender({ ...options, hasNegative: true });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("must not be negative");
  });

  it("does not warn about overflow or negative values for a single value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() =>
      useMeterDevWarnings({
        ...options,
        isSegmented: false,
        hasSegmentsToShow: false,
        hasOverflow: true,
        hasNegative: true,
      })
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it("warns once when segments are shown without a legend", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook((props) => useMeterDevWarnings(props), {
      initialProps: options,
    });
    rerender({ ...options });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("<Meter.Legend>");
  });

  it("does not warn about a missing legend when a legend is registered", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWithLegend(options);

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() =>
      useMeterDevWarnings({
        ...options,
        hasOverflow: true,
        hasNegative: true,
      })
    );

    expect(warn).not.toHaveBeenCalled();
  });
});
