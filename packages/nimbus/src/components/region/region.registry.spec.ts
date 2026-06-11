import { describe, it, expect, vi } from "vitest";
import { createRegionRegistry } from "./region.registry";

const el = () => ({}) as unknown as HTMLElement;

describe("createRegionRegistry", () => {
  it("returns null for an unregistered name", () => {
    const registry = createRegionRegistry();
    expect(registry.get("missing")).toBeNull();
  });

  it("stores and retrieves a node per name", () => {
    const registry = createRegionRegistry();
    const a = el();
    const b = el();
    registry.set("a", a);
    registry.set("b", b);
    expect(registry.get("a")).toBe(a);
    expect(registry.get("b")).toBe(b);
  });

  it("notifies only the name that changed", () => {
    const registry = createRegionRegistry();
    const aListener = vi.fn();
    const bListener = vi.fn();
    registry.subscribe("a", aListener);
    registry.subscribe("b", bListener);

    registry.set("a", el());

    expect(aListener).toHaveBeenCalledTimes(1);
    expect(bListener).not.toHaveBeenCalled();
  });

  it("does not notify when the node is unchanged", () => {
    const registry = createRegionRegistry();
    const node = el();
    const listener = vi.fn();
    registry.subscribe("a", listener);

    registry.set("a", node);
    registry.set("a", node); // same reference → no-op

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notifies on clear (node → null)", () => {
    const registry = createRegionRegistry();
    const listener = vi.fn();
    registry.set("a", el());
    registry.subscribe("a", listener);

    registry.set("a", null);

    expect(registry.get("a")).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops notifying after unsubscribe", () => {
    const registry = createRegionRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe("a", listener);

    registry.set("a", el());
    unsubscribe();
    registry.set("a", el());

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps names in a flat namespace, independent of one another", () => {
    const registry = createRegionRegistry();
    const outer = el();
    const inner = el();
    registry.set("nimbus-splitter:outer:aside", outer);
    registry.set("nimbus-splitter:inner:aside", inner);
    expect(registry.get("nimbus-splitter:outer:aside")).toBe(outer);
    expect(registry.get("nimbus-splitter:inner:aside")).toBe(inner);
  });
});
