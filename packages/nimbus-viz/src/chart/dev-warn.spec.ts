import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { devWarn, resetDevWarnings } from "./dev-warn";

describe("devWarn", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetDevWarnings();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    vi.unstubAllEnvs();
  });

  it("warns once per key, with the library prefix", () => {
    devWarn("k", "first");
    devWarn("k", "second");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("[nimbus-viz] first");
  });

  it("treats different keys independently", () => {
    devWarn("a", "one");
    devWarn("b", "two");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("fires again after resetDevWarnings", () => {
    devWarn("k", "m");
    resetDevWarnings();
    devWarn("k", "m");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("is silent in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    devWarn("prod", "should not print");
    expect(warn).not.toHaveBeenCalled();
  });
});
