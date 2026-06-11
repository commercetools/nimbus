import { useCallback, useContext, useEffect, useRef } from "react";
import type { Ref } from "react";
import { Box as ChakraBox } from "@chakra-ui/react/box";
import { RegionRegistryContext } from "./region.registry";
import type { RegionProps } from "./region.types";

/**
 * The `<Region name>` **target**: marks where a named region renders and
 * registers its DOM node under `name` so consumers can fill it via
 * `useRegion(name)`. Optionally publishes a `value` (control callbacks + state)
 * for that region.
 *
 * Renders a **layout-transparent** element — `display: contents`, so it
 * generates no box of its own and the projected children lay out as direct
 * children of the region's parent (precise layout, no extra wrapper). A portal
 * still needs a real DOM node as its container, which is why an element exists
 * at all; `display: contents` keeps that node out of the layout. Pass `style` to
 * override (e.g. `display: "block"`) if you want the target to be a real box.
 *
 * A `Region.Provider` must be an ancestor (it is, ambiently, inside
 * `NimbusProvider`); without one the target still renders but registers nowhere,
 * so no consumer can fill it.
 */
export const RegionTarget = ({ name, value, ref, ...props }: RegionProps) => {
  const registry = useContext(RegionRegistryContext);

  // Stable merged ref: forwards to the consumer's `ref` and registers/clears the
  // node under `name`. Read the consumer ref from a holder so identity is stable.
  const consumerRef = useRef<Ref<HTMLDivElement> | undefined>(ref);
  consumerRef.current = ref;
  // The node we last registered, so detach can release the slot owner-checked
  // (clearing only if we still hold it) rather than clobbering a newer target.
  const ownNodeRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      const r = consumerRef.current;
      if (typeof r === "function") r(node);
      else if (r != null)
        (r as { current: HTMLDivElement | null }).current = node;
      if (node) registry?.setNode(name, node);
      else registry?.clearNode(name, ownNodeRef.current);
      ownNodeRef.current = node;
    },
    [registry, name]
  );

  // Declare this target as the region's single occupant for the mount's lifetime;
  // a second concurrent target for the same name warns in development.
  useEffect(() => registry?.claim(name, "target"), [registry, name]);

  // Publish the value (when provided). Memoize `value` at the call site — its
  // identity changing is exactly what notifies consumers.
  useEffect(() => {
    if (value === undefined) return;
    registry?.setValue(name, value);
    return () => registry?.clearValue(name, value);
  }, [registry, name, value]);

  // `display: contents` — the target generates no box; projected children lay
  // out as if placed directly at the region's position. `{...props}` comes after
  // so a consumer can override (e.g. `display="block"`) and add style props.
  return <ChakraBox ref={setRef} display="contents" {...props} />;
};

RegionTarget.displayName = "Region";
