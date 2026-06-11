import { createContext } from "react";
import type { SplitterInstance } from "./splitter.types";

/**
 * A flat, string-keyed registry of `Splitter.Root` instances that carry an
 * `id`. It is what lets a component anywhere in the tree reach a *specific*
 * splitter by name — `useSplitter("mc-right-panel")` — regardless of how many
 * other splitters are nested in between.
 *
 * The namespace is **flat**: nesting is irrelevant because instances are keyed
 * by `id`, not by tree position. This is deliberately simpler than resolving up
 * a context chain — two nested splitters are just two independent entries.
 *
 * It is an external store (not React state) so that registering, unregistering,
 * or updating an instance does **not** re-render the host `Splitter.Root`
 * (which, when mounted at the shell root, wraps the entire app). Only the
 * `useSplitter(id)` consumers of a given `id` re-render, via
 * `useSyncExternalStore`.
 *
 * @internal
 */
export type SplitterRegistry = {
  /** Publish (or replace) the instance for an `id`, notifying its subscribers. */
  register: (id: string, instance: SplitterInstance) => void;
  /** Remove an `id` (on host unmount), notifying its subscribers. */
  unregister: (id: string) => void;
  /** Current instance for an `id`, or `null` if none is mounted. */
  get: (id: string) => SplitterInstance | null;
  /** Subscribe to changes for a single `id`. Returns an unsubscribe fn. */
  subscribe: (id: string, listener: () => void) => () => void;
};

/** Create a fresh, stable {@link SplitterRegistry}. */
export const createSplitterRegistry = (): SplitterRegistry => {
  const instances = new Map<string, SplitterInstance>();
  const listeners = new Map<string, Set<() => void>>();

  const emit = (id: string) =>
    listeners.get(id)?.forEach((listener) => listener());

  return {
    register: (id, instance) => {
      instances.set(id, instance);
      emit(id);
    },
    unregister: (id) => {
      instances.delete(id);
      emit(id);
    },
    get: (id) => instances.get(id) ?? null,
    subscribe: (id, listener) => {
      let set = listeners.get(id);
      if (!set) {
        set = new Set();
        listeners.set(id, set);
      }
      set.add(listener);
      return () => {
        set.delete(listener);
        if (set.size === 0) listeners.delete(id);
      };
    },
  };
};

/**
 * Context carrying the {@link SplitterRegistry}. The **outermost**
 * `Splitter.Root` (the first with no registry above it) creates the registry and
 * provides it; nested `Splitter.Root`s reuse the same one. `null` when no
 * `Splitter.Root` is mounted above the consumer.
 *
 * @internal
 */
export const SplitterRegistryContext = createContext<SplitterRegistry | null>(
  null
);
