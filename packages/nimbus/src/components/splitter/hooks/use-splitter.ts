import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import { SplitterRegistryContext } from "../splitter.registry";
import type { SplitterInstance } from "../splitter.types";

/**
 * Carries the **nearest** `Splitter.Root`'s public instance, for the no-argument
 * `useSplitter()` form. Separate from the internal `SplitterContext` (which
 * carries size/registration plumbing) so the public handle can be provided and
 * memoized independently. `null` outside any `Splitter.Root`.
 *
 * @internal
 */
export const SplitterHandleContext = createContext<SplitterInstance | null>(
  null
);

/**
 * Access a `Splitter.Root` instance — its collapse controls
 * (`isCollapsed` / `expand` / `collapse` / `toggle`) and its `MainRegion` /
 * `AsideRegion` portal components for projecting content into a pane.
 *
 * Two resolution modes:
 *
 * - **`useSplitter()`** — the **nearest** `Splitter.Root` above the caller. Use
 *   it from inside a splitter you own (or its panes) to drive collapse without
 *   threading props. Returns `null` when no `Splitter.Root` is an ancestor.
 *
 * - **`useSplitter(id)`** — the `Splitter.Root` mounted with that `id`,
 *   anywhere in the tree (e.g. a shell-level splitter), resolved through a flat
 *   registry that ignores nesting. Returns `null` until that splitter mounts and
 *   registers — so it is safe to call before the splitter exists; guard with
 *   optional chaining (`splitter?.expand()`).
 *
 * @example Remote control of a shell-mounted splitter from a nested consumer
 * const splitter = useSplitter("mc-right-panel");
 * useEffect(() => {
 *   splitter?.expand();
 *   return () => splitter?.collapse();
 * }, [splitter]);
 * if (!splitter) return null;
 * const { AsideRegion } = splitter;
 * return <AsideRegion>{panel}</AsideRegion>;
 */
export const useSplitter = (id?: string): SplitterInstance | null => {
  const registry = useContext(SplitterRegistryContext);
  const nearest = useContext(SplitterHandleContext);

  // Subscribe to the named instance. Hooks run unconditionally (rules of
  // hooks); the result is only used when an `id` was supplied.
  const subscribe = useCallback(
    (listener: () => void) =>
      id && registry ? registry.subscribe(id, listener) : () => {},
    [id, registry]
  );
  const getSnapshot = useCallback(
    () => (id && registry ? registry.get(id) : null),
    [id, registry]
  );
  const named = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return id ? named : nearest;
};
