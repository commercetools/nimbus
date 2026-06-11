import { createContext } from "react";
import type { RegionRecord, RegionRegistry } from "./region.types";

/** Create a fresh, stable {@link RegionRegistry}. */
export const createRegionRegistry = (): RegionRegistry => {
  const records = new Map<string, RegionRecord>();
  const listeners = new Map<string, Set<() => void>>();

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
    setValue: (name, value) => update(name, { value }),
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
