import type { ComponentPropsWithoutRef, FC, ReactNode, Ref } from "react";

/**
 * A flat, string-keyed registry of **named regions** — each a live DOM node a
 * `Region.Outlet` exposes for others to render into. It is the mechanism behind
 * "render this content over there": a consumer projects children into a region
 * by name, and they paint at the outlet while staying in their author's React
 * tree (preserving context).
 *
 * Deliberately component-agnostic: the `Splitter` is the first consumer (its
 * panes are outlets), but any component can host outlets and any consumer can
 * target them. The namespace is flat — names, not tree position, identify a
 * region — so nesting is irrelevant.
 *
 * It is an external store (not React state) so registering / clearing a node
 * never re-renders the `Region.Provider` (which may wrap a whole app); only the
 * consumers of that specific name re-render, via `useSyncExternalStore`.
 */
export type RegionRegistry = {
  /** Current DOM node registered under `name`, or `null` if no outlet is mounted. */
  get: (name: string) => HTMLElement | null;
  /** Set (or clear) the node for `name`. No-ops when unchanged. */
  set: (name: string, node: HTMLElement | null) => void;
  /** Subscribe to changes for a single `name`. Returns an unsubscribe fn. */
  subscribe: (name: string, listener: () => void) => () => void;
};

/**
 * A portal component bound to one region name. Renders its `children` into that
 * region's outlet node (via `createPortal`), or `null` until the outlet mounts.
 * Stable identity, so the projected subtree is never torn down on unrelated
 * re-renders.
 */
export type RegionPortal = FC<{ children: ReactNode }>;

/** Props for `<Region.Outlet>` — a div that registers itself under `name`. */
export type RegionOutletProps = ComponentPropsWithoutRef<"div"> & {
  /** The region name this outlet fulfills. Consumers target it via `useRegion(name)`. */
  name: string;
  /** Ref to the outlet element. */
  ref?: Ref<HTMLDivElement>;
};

/** Props for `<Region.Provider>`. */
export type RegionProviderProps = {
  /** The subtree that may host outlets and project into them. */
  children: ReactNode;
};

/** Return value of {@link useRegion}. */
export type UseRegionResult = {
  /** The outlet's live DOM node for the requested name, or `null`. */
  node: HTMLElement | null;
  /** A stable portal component that renders its children into the named region. */
  Region: RegionPortal;
};
