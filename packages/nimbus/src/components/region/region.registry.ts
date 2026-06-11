import { createContext } from "react";
import type { RegionRecord, RegionRegistry } from "./region.types";

/** Whether to emit single-occupancy collision warnings (dev only). */
const isDev = process.env.NODE_ENV !== "production";

/** Create a fresh, stable {@link RegionRegistry}. */
export const createRegionRegistry = (): RegionRegistry => {
  const records = new Map<string, RegionRecord>();
  const listeners = new Map<string, Set<() => void>>();
  // Live participant counts per name, used only to detect competing occupants.
  const claims = new Map<string, { target: number; filler: number }>();

  const emit = (name: string) =>
    listeners.get(name)?.forEach((listener) => listener());

  // Replace the record with a new object (so `get` snapshots change identity
  // only on real change) and notify. Drops the entry once both halves are empty.
  const update = (name: string, patch: Partial<RegionRecord>) => {
    const existing = records.get(name);
    const prev = existing ?? { node: null, value: null };
    const next = { ...prev, ...patch };
    if (
      existing &&
      next.node === existing.node &&
      next.value === existing.value
    )
      return;
    if (next.node === null && next.value === null) {
      if (!existing) return;
      records.delete(name);
    } else {
      records.set(name, next);
    }
    emit(name);
  };

  return {
    get: (name) => records.get(name) ?? null,
    setNode: (name, node) => update(name, { node }),
    clearNode: (name, node) => {
      // Owner-checked: only the target that currently holds the slot may clear
      // it. A stale duplicate unmounting after a newer target took over (or a
      // target moving, where the new node attaches before the old detaches) is
      // then a no-op, instead of wiping a live region out from under it.
      if (records.get(name)?.node === node) update(name, { node: null });
    },
    setValue: (name, value) => update(name, { value }),
    clearValue: (name, expectedValue) => {
      if (records.get(name)?.value === expectedValue)
        update(name, { value: null });
    },
    claim: (name, role) => {
      let count = claims.get(name);
      if (!count) {
        count = { target: 0, filler: 0 };
        claims.set(name, count);
      }
      count[role] += 1;
      if (isDev && count[role] > 1) {
        if (role === "target")
          console.error(
            `[Nimbus Region] Two <Region name="${name}"> targets are mounted at ` +
              `once. A region name must have exactly one target; the extra one is ` +
              `orphaned and projection becomes order-dependent. Use a unique name ` +
              `per target.`
          );
        else
          console.error(
            `[Nimbus Region] Two consumers are projecting into region "${name}" via ` +
              `useRegion("${name}"). A region accepts a single filler; competing ` +
              `content stacks into the target in an undefined order. Give each its ` +
              `own region name.`
          );
      }
      return () => {
        count![role] -= 1;
        if (count!.target === 0 && count!.filler === 0) claims.delete(name);
      };
    },
    subscribe: (name, listener) => {
      let set = listeners.get(name);
      if (!set) {
        set = new Set();
        listeners.set(name, set);
      }
      set.add(listener);
      return () => {
        set.delete(listener);
        if (set.size === 0) listeners.delete(name);
      };
    },
  };
};

/**
 * Context carrying the {@link RegionRegistry}. The outermost `Region.Provider`
 * (the first with no provider above it) creates and provides the registry;
 * nested providers reuse it. `null` when no `Region.Provider` is an ancestor.
 */
export const RegionRegistryContext = createContext<RegionRegistry | null>(null);
