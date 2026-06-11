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
    registry.setNode("a", a);
    expect(registry.get("a")).toEqual({ node: a, value: null });
  });

  it("stores a value independently of the node", () => {
    const registry = createRegionRegistry();
    const controls = { expand: () => {} };
    registry.setValue("a", controls);
    expect(registry.get("a")).toEqual({ node: null, value: controls });

    const node = el();
    registry.setNode("a", node);
    expect(registry.get("a")).toEqual({ node, value: controls });
  });

  it("replaces the record identity on change (stable snapshots)", () => {
    const registry = createRegionRegistry();
    registry.setNode("a", el());
    const first = registry.get("a");
    const second = registry.get("a");
    expect(first).toBe(second); // unchanged → same reference

    registry.setValue("a", { v: 1 });
    expect(registry.get("a")).not.toBe(first); // changed → new reference
  });

  it("notifies only the name that changed", () => {
    const registry = createRegionRegistry();
    const aListener = vi.fn();
    const bListener = vi.fn();
    registry.subscribe("a", aListener);
    registry.subscribe("b", bListener);

    registry.setNode("a", el());

    expect(aListener).toHaveBeenCalledTimes(1);
    expect(bListener).not.toHaveBeenCalled();
  });

  it("does not notify when a write is reference-equal", () => {
    const registry = createRegionRegistry();
    const node = el();
    const value = { v: 1 };
    const listener = vi.fn();
    registry.subscribe("a", listener);

    registry.setNode("a", node);
    registry.setValue("a", value);
    registry.setNode("a", node); // unchanged
    registry.setValue("a", value); // unchanged

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("drops the record once node and value are both cleared", () => {
    const registry = createRegionRegistry();
    const listener = vi.fn();
    registry.setNode("a", el());
    registry.subscribe("a", listener);

    registry.setNode("a", null);

    expect(registry.get("a")).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps a value after the node is cleared (e.g. outlet remounts)", () => {
    const registry = createRegionRegistry();
    const value = { v: 1 };
    registry.setValue("a", value);
    registry.setNode("a", el());

    registry.setNode("a", null);

    expect(registry.get("a")).toEqual({ node: null, value });
  });

  it("stops notifying after unsubscribe", () => {
    const registry = createRegionRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe("a", listener);

    registry.setNode("a", el());
    unsubscribe();
    registry.setNode("a", null);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps names in a flat namespace, independent of one another", () => {
    const registry = createRegionRegistry();
    const outer = el();
    const inner = el();
    registry.setNode("app:outer", outer);
    registry.setNode("app:inner", inner);
    expect(registry.get("app:outer")?.node).toBe(outer);
    expect(registry.get("app:inner")?.node).toBe(inner);
  });
});
