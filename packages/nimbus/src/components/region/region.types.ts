import type { ComponentPropsWithoutRef, FC, ReactNode, Ref } from "react";

/**
 * What a region holds: the live outlet DOM `node` (where content paints) and an
 * optional `value` the outlet's host publishes for consumers — typically
 * callbacks and reactive state (e.g. a panel's `expand` / `collapse` /
 * `isCollapsed`). Either half may be absent.
 */
export type RegionRecord<T = unknown> = {
  /** The outlet's DOM node, or `null` until it mounts. */
  node: HTMLElement | null;
  /** Arbitrary value published for this region (callbacks, state), or `null`. */
  value: T | null;
};

/**
 * A flat, string-keyed registry of **named regions**. Each name maps to a
 * {@link RegionRecord} — a render target (`node`) and/or a published `value`. It
 * is the mechanism behind "render this content over there, and let a consumer
 * drive it": an outlet publishes a node (and optionally a value) under a name,
 * and a consumer reads both by that name from anywhere.
 *
 * Deliberately component-agnostic and **nesting-agnostic** — names, not tree
 * position, identify a region. It is an external store (not React state) so
 * publishing a node or value never re-renders the `Region.Root` (which may
 * wrap a whole app); only the consumers of that name re-render, via
 * `useSyncExternalStore`.
 */
export type RegionRegistry = {
  /** Current record for `name` (a stable reference until it changes), or `null`. */
  get: (name: string) => RegionRecord | null;
  /** Publish (or clear) the outlet node for `name`. No-ops when unchanged. */
  setNode: (name: string, node: HTMLElement | null) => void;
  /** Publish (or clear) the value for `name`. No-ops when reference-equal. */
  setValue: (name: string, value: unknown) => void;
  /** Subscribe to changes (node or value) for a single `name`. Returns an unsubscribe fn. */
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
  /**
   * An optional value to publish for this region (e.g. control callbacks +
   * state). Memoize it at the call site — its identity changing is what notifies
   * consumers, so unstable values cause needless re-renders. Keep callbacks
   * stable (ref-backed) so consumer effects that depend on them don't re-run on
   * every state change.
   *
   * @example
   * const commands = useRef({ open: () => setOpen(true) }).current; // stable
   * const value = useMemo(() => ({ isOpen, ...commands }), [isOpen, commands]);
   * return <Region.Outlet name="panel" value={value} />;
   */
  value?: unknown;
  /** Ref to the outlet element. */
  ref?: Ref<HTMLDivElement>;
};

/** Props for `<Region.Root>`. */
export type RegionRootProps = {
  /** The subtree that may host outlets and project into them. */
  children: ReactNode;
};

/** Return value of {@link useRegion}. */
export type UseRegionResult<T = unknown> = {
  /** The outlet's live DOM node for the requested name, or `null`. */
  node: HTMLElement | null;
  /** The value published for the requested name, or `null`. */
  value: T | null;
  /**
   * A stable portal component that renders its children into the named region.
   * Rename it at the call site to avoid shadowing the `Region` namespace export.
   *
   * @example
   * const { Region: Sidebar } = useRegion("sidebar");
   * return <Sidebar>{content}</Sidebar>;
   */
  Region: RegionPortal;
};
