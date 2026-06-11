import { useCallback, useContext, useRef } from "react";
import type { Ref } from "react";
import { RegionRegistryContext } from "./region.registry";
import type { RegionOutletProps } from "./region.types";

/**
 * Marks where a named region renders, and registers its DOM node under `name`
 * so consumers can project content into it via `useRegion(name)`. Renders a
 * plain `div` that fills its parent by default; pass `style` / props to adjust.
 *
 * A `Region.Provider` must be an ancestor; without one the outlet still renders
 * but registers nowhere (no consumer can target it).
 */
export const RegionOutlet = ({
  name,
  style,
  ref,
  ...props
}: RegionOutletProps) => {
  const registry = useContext(RegionRegistryContext);

  // Stable merged ref: forwards to the consumer's `ref` and registers/clears the
  // node under `name`. Read the consumer ref from a holder so identity is stable.
  const consumerRef = useRef<Ref<HTMLDivElement> | undefined>(ref);
  consumerRef.current = ref;
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      const r = consumerRef.current;
      if (typeof r === "function") r(node);
      else if (r != null)
        (r as { current: HTMLDivElement | null }).current = node;
      registry?.set(name, node);
    },
    [registry, name]
  );

  return (
    <div
      ref={setRef}
      style={{ width: "100%", height: "100%", ...style }}
      {...props}
    />
  );
};

RegionOutlet.displayName = "Region.Outlet";
