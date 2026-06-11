import { createContext } from "react";
import type { RegionRegistry } from "./region.types";

/** Create a fresh, stable {@link RegionRegistry}. */
export const createRegionRegistry = (): RegionRegistry => {
  const nodes = new Map<string, HTMLElement | null>();
  const listeners = new Map<string, Set<() => void>>();

  const emit = (name: string) =>
    listeners.get(name)?.forEach((listener) => listener());

  return {
    get: (name) => nodes.get(name) ?? null,
    set: (name, node) => {
      if ((nodes.get(name) ?? null) === node) return;
      nodes.set(name, node);
      emit(name);
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
