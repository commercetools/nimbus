import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { MeterLabel } from "./meter.label";
import { MeterLegend } from "./meter.legend";
import { MeterTrack } from "./meter.track";
import { MeterValue } from "./meter.value";

describe("Meter parts outside Meter.Root", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["Meter.Label", () => <MeterLabel>Storage</MeterLabel>],
    ["Meter.Value", () => <MeterValue />],
    ["Meter.Track", () => <MeterTrack />],
    ["Meter.Legend", () => <MeterLegend />],
  ])("%s throws an error that names Meter.Root", (_, renderPart) => {
    // React logs the thrown error; keep the test output clean
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(renderPart())).toThrow(
      "useMeterContext must be used within Meter.Root"
    );
  });
});
