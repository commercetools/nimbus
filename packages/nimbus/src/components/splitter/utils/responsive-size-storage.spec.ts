import { describe, it, expect } from "vitest";
import {
  parseStoredBands,
  serializeStoredBands,
  STORAGE_VERSION,
} from "./responsive-size-storage";

describe("parseStoredBands", () => {
  it("returns null for absent or empty input", () => {
    expect(parseStoredBands(null)).toBeNull();
    expect(parseStoredBands("")).toBeNull();
  });

  it("returns null for corrupt JSON", () => {
    expect(parseStoredBands("{not json")).toBeNull();
  });

  it("returns null for an unknown/older version", () => {
    expect(
      parseStoredBands(
        JSON.stringify({ v: 0, bands: { "0": { unit: "px", value: 1 } } })
      )
    ).toBeNull();
  });

  it("parses a valid payload into a numeric-keyed band map", () => {
    const raw = JSON.stringify({
      v: STORAGE_VERSION,
      bands: {
        "0": { unit: "px", value: 320 },
        "768": { unit: "pct", value: 30 },
      },
    });
    expect(parseStoredBands(raw)).toEqual({
      0: { unit: "px", value: 320 },
      768: { unit: "pct", value: 30 },
    });
  });

  it("drops malformed bands but keeps valid ones", () => {
    const raw = JSON.stringify({
      v: STORAGE_VERSION,
      bands: {
        "0": { unit: "px", value: 320 },
        "768": { unit: "bogus", value: 30 },
        "1024": { unit: "px", value: "nope" },
      },
    });
    expect(parseStoredBands(raw)).toEqual({ 0: { unit: "px", value: 320 } });
  });
});

describe("serializeStoredBands", () => {
  it("round-trips through parse", () => {
    const bands = { 0: { unit: "px" as const, value: 296 } };
    expect(parseStoredBands(serializeStoredBands(bands))).toEqual(bands);
  });
});
