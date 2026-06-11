import { describe, expect, it } from "vitest";
import { isNimbusResolvable } from "./is-nimbus-resolvable";

describe("isNimbusResolvable", () => {
  it("returns true when running inside the nimbus workspace", () => {
    expect(isNimbusResolvable()).toBe(true);
  });

  it("returns a boolean", () => {
    expect(typeof isNimbusResolvable()).toBe("boolean");
  });
});
