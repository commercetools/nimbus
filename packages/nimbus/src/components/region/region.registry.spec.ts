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

  describe("clearNode (owner-checked release)", () => {
    it("clears the slot when the calling node still owns it", () => {
      const registry = createRegionRegistry();
      const node = el();
      registry.setNode("a", node);

      registry.clearNode("a", node);

      expect(registry.get("a")).toBeNull();
    });

    it("is a no-op when a newer node has taken the slot", () => {
      const registry = createRegionRegistry();
      const stale = el();
      const fresh = el();
      registry.setNode("a", stale);
      registry.setNode("a", fresh); // a second target took over

      // The stale target unmounts and tries to release — must NOT wipe the live one.
      registry.clearNode("a", stale);

      expect(registry.get("a")?.node).toBe(fresh);
    });

    it("does not notify when an owner-check fails (no spurious churn)", () => {
      const registry = createRegionRegistry();
      const stale = el();
      const fresh = el();
      registry.setNode("a", stale);
      registry.setNode("a", fresh);
      const listener = vi.fn();
      registry.subscribe("a", listener);

      registry.clearNode("a", stale);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("claim (single-occupancy detection)", () => {
    it("does not warn for a lone target or a lone filler", () => {
      const registry = createRegionRegistry();
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      const releaseTarget = registry.claim("a", "target");
      const releaseFiller = registry.claim("a", "filler");

      expect(spy).not.toHaveBeenCalled();
      releaseTarget();
      releaseFiller();
      spy.mockRestore();
    });

    it("warns when a second target claims the same name", () => {
      const registry = createRegionRegistry();
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      registry.claim("a", "target");
      registry.claim("a", "target");

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain("targets are mounted");
      spy.mockRestore();
    });

    it("warns when a second filler claims the same name", () => {
      const registry = createRegionRegistry();
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      registry.claim("a", "filler");
      registry.claim("a", "filler");

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain("projecting into region");
      spy.mockRestore();
    });

    it("does not warn after the first occupant releases (mount/unmount/mount)", () => {
      const registry = createRegionRegistry();
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      const release = registry.claim("a", "filler");
      release();
      registry.claim("a", "filler"); // re-mount — still single-occupancy

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("keeps target and filler counts independent (one of each is fine)", () => {
      const registry = createRegionRegistry();
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      registry.claim("a", "target");
      registry.claim("a", "filler");
      registry.claim("a", "target"); // second target — only this warns

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain("targets are mounted");
      spy.mockRestore();
    });
  });
});
