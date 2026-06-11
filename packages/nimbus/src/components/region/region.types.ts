import type { FC, ReactNode, Ref } from "react";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";

/**
 * What a region holds internally: the live target DOM `node` (where projected
 * content paints) and an optional `value` the target publishes for consumers —
 * typically callbacks and reactive state (e.g. a panel's `expand` / `collapse` /
 * `isCollapsed`). Either half may be absent. The `node` is an internal detail
 * (it drives the portal); consumers read only the `value` via `useRegion`.
 */
export type RegionRecord<T = unknown> = {
  /** The target's DOM node, or `null` until it mounts. */
  node: HTMLElement | null;
  /** Arbitrary value published for this region (callbacks, state), or `null`. */
  value: T | null;
};

/**
 * A flat, string-keyed registry of **named regions**. Each name maps to a
 * {@link RegionRecord} — a render target (`node`) and/or a published `value`. It
 * is the mechanism behind "render this content over there, and let a consumer
 * drive it": a `Region` target publishes a node (and optionally a value) under a
 * name, and a consumer reads it by that name from anywhere.
 *
 * Deliberately component-agnostic and **nesting-agnostic** — names, not tree
 * position, identify a region. It is an external store (not React state) so
 * publishing a node or value never re-renders the `Region.Provider` (which may
 * wrap a whole app); only the consumers of that name re-render, via
 * `useSyncExternalStore`.
 */
export type RegionRegistry = {
  /** Current record for `name` (a stable reference until it changes), or `null`. */
  get: (name: string) => RegionRecord | null;
  /** Publish (or clear) the target node for `name`. No-ops when unchanged. */
  setNode: (name: string, node: HTMLElement | null) => void;
  /**
   * Clear `name`'s node **only if** `node` is the one currently registered — an
   * owner-checked release for a target's unmount. A stale target unmounting after
   * a newer one took the slot is then a no-op, instead of wiping the live region.
   */
  clearNode: (name: string, node: HTMLElement | null) => void;
  /** Publish (or clear) the value for `name`. No-ops when reference-equal. */
  setValue: (name: string, value: unknown) => void;
  /**
   * Clear `name`'s value **only if** `expectedValue` is the one currently
   * registered — an owner-checked release mirroring {@link clearNode}.
   */
  clearValue: (name: string, expectedValue: unknown) => void;
  /** Subscribe to changes (node or value) for a single `name`. Returns an unsubscribe fn. */
  subscribe: (name: string, listener: () => void) => () => void;
  /**
   * Register a live participant in `name` for the duration of a mount, declaring
   * whether it is the region's `"target"` (the `<Region name>` outlet) or a
   * `"filler"` (a `useRegion` portal projecting into it). Returns a release fn to
   * call on unmount. A region is single-occupancy on both sides: in development,
   * a second concurrent target — or a second concurrent filler — for the same
   * name logs a `console.error`, since competing occupants render in an
   * undefined, stacked order. No-ops (beyond bookkeeping) in production.
   */
  claim: (name: string, role: "target" | "filler") => () => void;
};

/**
 * A portal component bound to one region name, returned by {@link useRegion}.
 * Renders its `children` into that region's target node (via `createPortal`), or
 * `null` until the target mounts. Stable identity, so the projected subtree is
 * never torn down on unrelated re-renders.
 */
export type RegionPortal = FC<{ children: ReactNode }>;

/**
 * Props for the `<Region name>` **target** — the placeholder that marks where a
 * named region renders. Consumers fill it via `useRegion(name)`. Backed by a
 * `chakra.div`, so it accepts Chakra style props (`p`, `bg`, `display`, …) in
 * addition to standard DOM attributes.
 */
export type RegionProps = HTMLChakraProps<"div"> & {
  /** The region name this target fulfills. Consumers fill it via `useRegion(name)`. */
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
   * return <Region name="panel" value={value} />;
   */
  value?: unknown;
  /** Ref to the target element. */
  ref?: Ref<HTMLDivElement>;
};

/** Props for `<Region.Provider>`. */
export type RegionProviderProps = {
  /** The subtree that may host region targets and project into them. */
  children: ReactNode;
};

/** Return value of {@link useRegion}. */
export type UseRegionResult<T = unknown> = {
  /**
   * A stable portal component that renders its children into the named region's
   * target. Rename it at the call site to avoid shadowing the `Region` target
   * export.
   *
   * @example
   * const { Region: Sidebar } = useRegion("sidebar");
   * return <Sidebar>{content}</Sidebar>;
   */
  Region: RegionPortal;
  /** The value published by the region's target for the requested name, or `null`. */
  value: T | null;
};
