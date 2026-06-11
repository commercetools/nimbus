import { useContext, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { RegionRegistryContext } from "./region.registry";
import type { RegionPortal } from "./region.types";

/**
 * Build a stable portal component bound to one region `name`. The returned
 * component renders its `children` into that region's target node, or `null`
 * until the target mounts. It resolves the registry from context at its own
 * render position, so it targets the correct (shared, outermost) registry
 * regardless of where the consumer renders it.
 *
 * @internal
 */
export const createRegionPortal = (name: string): RegionPortal => {
  const Portal: RegionPortal = ({ children }) => {
    const registry = useContext(RegionRegistryContext);
    const [subscribe, getSnapshot] = useMemo(
      () =>
        [
          (listener: () => void) =>
            registry ? registry.subscribe(name, listener) : () => {},
          () => (registry ? registry.get(name) : null),
        ] as const,
      [registry]
    );
    // Server snapshot is `null`: no targets exist during SSR and `createPortal`
    // is client-only, so the portal renders nothing until hydration.
    const record = useSyncExternalStore(subscribe, getSnapshot, () => null);
    const node = record?.node ?? null;
    return node ? createPortal(children, node) : null;
  };
  Portal.displayName = `Region.Portal(${name})`;
  return Portal;
};
