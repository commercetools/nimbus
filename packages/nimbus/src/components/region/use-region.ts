import { useContext, useMemo, useRef, useSyncExternalStore } from "react";
import { createRegionPortal } from "./region.portal";
import { RegionRegistryContext } from "./region.registry";
import type { RegionPortal, UseRegionResult } from "./region.types";

/** Stable no-op portal for the `name`-less call (renders nothing). */
const EmptyRegion: RegionPortal = () => null;
EmptyRegion.displayName = "Region.Portal(none)";

/**
 * Access a named region: a stable `Region` portal component to project content
 * into it, plus the `value` its target published (control callbacks + state).
 * `value` is `null` until a target with that name mounts and publishes one, so
 * it is safe to call before the target exists.
 *
 * Pass `undefined` (or omit `name`) to get a no-op portal that renders nothing —
 * useful for conditional projection without violating the rules of hooks:
 * `useRegion(isEnabled ? "sidebar" : undefined)`.
 *
 * @example
 * const { Region, value } = useRegion<PanelControls>("my-sidebar");
 * value?.expand();
 * return <Region>{content}</Region>; // paints at the target, stays in this tree
 */
export const useRegion = <T = unknown>(name?: string): UseRegionResult<T> => {
  const registry = useContext(RegionRegistryContext);

  // Cache one stable portal per name so the projected subtree never remounts.
  // Intentionally unbounded — names should be static strings, not dynamic IDs.
  const cacheRef = useRef<Map<string, RegionPortal>>(new Map());
  let Region: RegionPortal = EmptyRegion;
  if (name) {
    let cached = cacheRef.current.get(name);
    if (!cached) {
      cached = createRegionPortal(name);
      cacheRef.current.set(name, cached);
    }
    Region = cached;
  }

  const [subscribe, getSnapshot] = useMemo(
    () =>
      [
        (listener: () => void) =>
          name && registry ? registry.subscribe(name, listener) : () => {},
        () => (name && registry ? registry.get(name) : null),
      ] as const,
    [registry, name]
  );
  // Server snapshot is `null`: there are no outlets during SSR and `createPortal`
  // is client-only, so a region resolves to nothing until hydration.
  const record = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return {
    Region,
    value: (record?.value ?? null) as T | null,
  };
};
