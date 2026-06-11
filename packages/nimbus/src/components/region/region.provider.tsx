import { useContext, useRef } from "react";
import { createRegionRegistry, RegionRegistryContext } from "./region.registry";
import type { RegionProviderProps, RegionRegistry } from "./region.types";

/**
 * Establishes a named-region scope. Outlets within it register by name; consumers
 * within it project into those outlets. Reuse-or-create: if a `Region.Provider` is
 * already above this one, its registry is reused (so the namespace is shared
 * across nesting); otherwise this provider creates and hosts the registry.
 *
 * Wrap it around any subtree that should share a set of regions — e.g. around a
 * `Splitter` so a consumer can project into a pane.
 */
export const RegionProvider = ({ children }: RegionProviderProps) => {
  const parent = useContext(RegionRegistryContext);
  const ownRef = useRef<RegionRegistry | null>(null);
  if (!parent && !ownRef.current) ownRef.current = createRegionRegistry();
  const registry = parent ?? ownRef.current!;

  // Reuse the ancestor registry as-is when present (it is already in context).
  if (parent) return <>{children}</>;
  return (
    <RegionRegistryContext.Provider value={registry}>
      {children}
    </RegionRegistryContext.Provider>
  );
};

RegionProvider.displayName = "Region.Provider";
