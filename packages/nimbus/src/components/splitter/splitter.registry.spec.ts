import { describe, it, expect, vi } from "vitest";
import { createSplitterRegistry } from "./splitter.registry";
import type { SplitterInstance } from "./splitter.types";

// A minimal stand-in instance; the registry treats it as an opaque value.
const instance = (label: string) =>
  ({ isCollapsed: false, label }) as unknown as SplitterInstance;

describe("createSplitterRegistry", () => {
  it("returns null for an unknown id", () => {
    const registry = createSplitterRegistry();
    expect(registry.get("missing")).toBeNull();
  });

  it("stores and retrieves an instance by id", () => {
    const registry = createSplitterRegistry();
    const a = instance("a");
    registry.register("a", a);
    expect(registry.get("a")).toBe(a);
  });

  it("keeps ids in a flat namespace, independent of one another", () => {
    const registry = createSplitterRegistry();
    const a = instance("a");
    const b = instance("b");
    registry.register("outer", a);
    registry.register("inner", b);
    expect(registry.get("outer")).toBe(a);
    expect(registry.get("inner")).toBe(b);
  });

  it("replaces an instance and notifies that id's subscribers", () => {
    const registry = createSplitterRegistry();
    const listener = vi.fn();
    registry.subscribe("a", listener);

    registry.register("a", instance("v1"));
    const v2 = instance("v2");
    registry.register("a", v2);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(registry.get("a")).toBe(v2);
  });

  it("only notifies subscribers of the changed id", () => {
    const registry = createSplitterRegistry();
    const aListener = vi.fn();
    const bListener = vi.fn();
    registry.subscribe("a", aListener);
    registry.subscribe("b", bListener);

    registry.register("a", instance("a"));

    expect(aListener).toHaveBeenCalledTimes(1);
    expect(bListener).not.toHaveBeenCalled();
  });

  it("unregister clears the instance and notifies subscribers", () => {
    const registry = createSplitterRegistry();
    const listener = vi.fn();
    registry.register("a", instance("a"));
    registry.subscribe("a", listener);

    registry.unregister("a");

    expect(registry.get("a")).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops notifying after unsubscribe", () => {
    const registry = createSplitterRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe("a", listener);

    registry.register("a", instance("v1"));
    unsubscribe();
    registry.register("a", instance("v2"));

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
