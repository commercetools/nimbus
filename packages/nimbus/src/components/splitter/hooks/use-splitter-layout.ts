import { useCallback, useEffect, useMemo, useRef } from "react";
import type { SplitterImperativeHandle } from "../splitter.types";

const DEFAULT_DEBOUNCE_MS = 200;

type StorageAdapter = {
  load(): Record<string, number> | undefined;
  save(sizes: Record<string, number>): void;
};

export type UseSplitterLayoutOptions = {
  /** Initial sizes (id-keyed, summing to 100). Read once on mount. */
  initialSizes: Record<string, number>;
  /**
   * When set (and no `storage` adapter is provided), the hook persists to
   * `localStorage.setItem(id, JSON.stringify(sizes))` and reads on mount.
   * Falls back gracefully on SSR / unavailable localStorage.
   */
  id?: string;
  /**
   * Custom storage adapter. Overrides `id`. Use this for cookies, server
   * persistence, or sessionStorage.
   */
  storage?: StorageAdapter;
  /** Debounce window for save() calls, in milliseconds. Defaults to 200. */
  debounceMs?: number;
};

export type UseSplitterLayoutResult = {
  /** Spread on `Splitter.Root` — the hydrated initial sizes. */
  defaultSizes: Record<string, number>;
  /** Spread on `Splitter.Root` — debounced persistence + cache update. */
  onSizesChange: (sizes: Record<string, number>) => void;
  /** Internal ref the Root attaches its imperative API to. */
  __layoutRef: React.RefObject<SplitterImperativeHandle | null>;
  /** Force a new sizes record from anywhere; fires `onSizesChange` on Root. */
  setSizes: (sizes: Record<string, number>) => void;
  /** Read the current sizes record from anywhere (post-drag). */
  getSizes: () => Record<string, number>;
  /** Collapse a collapsible pane from outside the splitter subtree. */
  collapse: (paneId: string) => void;
  /** Expand a collapsed pane from outside the splitter subtree. */
  expand: (paneId: string) => void;
  /** True if the pane's current size is at or below its `collapsedSize`. */
  isCollapsed: (paneId: string) => boolean;
};

const isBrowser = (): boolean => typeof window !== "undefined";

const isValidSizes = (value: unknown): value is Record<string, number> => {
  if (!value || typeof value !== "object") return false;
  for (const v of Object.values(value as Record<string, unknown>)) {
    if (typeof v !== "number" || !Number.isFinite(v)) return false;
  }
  return true;
};

/** True when `v` is a finite number within the valid percentage range. */
const isInRange = (v: number | undefined): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100;

/**
 * Reconcile a stored sizes record against the consumer's two-pane
 * `initialSizes`. A 2-pane splitter's layout is a single number — the boundary
 * position — so the second pane is always the complement of the first. We
 * resolve the first pane's size from the most trustworthy source available and
 * infer the partner as `100 − first`:
 *   1. the stored value for the first pane, if valid and in range;
 *   2. otherwise the complement of the stored value for the second pane
 *      (salvages a renamed / partial record); else
 *   3. `initialSizes` (nothing salvageable).
 * Unknown stored ids are ignored. Logs a development-only warning when the
 * resolved record differs from what was stored.
 */
const reconcileStored = (
  stored: Record<string, number> | undefined,
  initialSizes: Record<string, number>
): Record<string, number> => {
  const ids = Object.keys(initialSizes);
  // Defensive: the Splitter primitive is strictly 2-pane.
  if (ids.length !== 2) return initialSizes;
  const [a, b] = ids as [string, string];

  if (!stored) return initialSizes;

  let first: number;
  if (isInRange(stored[a])) {
    first = stored[a];
  } else if (isInRange(stored[b])) {
    first = 100 - stored[b];
  } else {
    first = initialSizes[a]!;
  }

  const resolved = { [a]: first, [b]: 100 - first };

  if (process.env.NODE_ENV !== "production") {
    const changed =
      stored[a] !== resolved[a] ||
      stored[b] !== resolved[b] ||
      Object.keys(stored).length !== 2;
    if (changed) {
      console.warn(
        "[Splitter] Reconciled stored layout against initial sizes (unknown ids dropped, partner inferred, or fell back to defaults)."
      );
    }
  }

  return resolved;
};

const readFromStorage = (
  options: UseSplitterLayoutOptions
): Record<string, number> | undefined => {
  if (options.storage) {
    try {
      const loaded = options.storage.load();
      return isValidSizes(loaded) ? loaded : undefined;
    } catch {
      return undefined;
    }
  }
  if (!options.id || !isBrowser()) return undefined;
  try {
    const raw = window.localStorage.getItem(options.id);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as unknown;
    return isValidSizes(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Persistence + imperative-commands companion for `Splitter`. Reads stored
 * sizes synchronously on first render (no flicker), reconciles them against
 * the consumer's `initialSizes`, debounces saves, and exposes an imperative
 * API the consumer can call from anywhere with access to the returned object.
 *
 * Spread `defaultSizes`, `onSizesChange`, and the internal `__layoutRef` prop
 * on Root to wire the component up:
 *
 * ```tsx
 * const layout = useSplitterLayout({
 *   initialSizes: { nav: 30, main: 70 },
 *   id: "ide-layout",
 * });
 *
 * <Splitter.Root
 *   panes={{ nav: { minSize: 10 }, main: { minSize: 20 } }}
 *   defaultSizes={layout.defaultSizes}
 *   onSizesChange={layout.onSizesChange}
 *   __layoutRef={layout.__layoutRef}
 * >
 *   …
 * </Splitter.Root>
 *
 * // Elsewhere:
 * layout.collapse("nav");
 * ```
 */
export const useSplitterLayout = (
  options: UseSplitterLayoutOptions
): UseSplitterLayoutResult => {
  const { initialSizes, debounceMs = DEFAULT_DEBOUNCE_MS } = options;

  // Synchronously read stored sizes on mount; useMemo with [] deps to keep
  // the result stable across renders (consumer's `initialSizes` is read once).
  const defaultSizes = useMemo<Record<string, number>>(() => {
    const stored = readFromStorage(options);
    return reconcileStored(stored, initialSizes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cache the current sizes for `getSizes()` (post-drag reads).
  const currentSizesRef = useRef<Record<string, number>>(defaultSizes);

  // Imperative handle the Root component mounts into.
  const layoutRef = useRef<SplitterImperativeHandle | null>(null);

  // Debounced save plumbing.
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<Record<string, number> | null>(null);

  const flushSave = useCallback(() => {
    if (!pendingSaveRef.current) return;
    const toSave = pendingSaveRef.current;
    pendingSaveRef.current = null;
    if (options.storage) {
      try {
        options.storage.save(toSave);
      } catch {
        // Storage failures must not break the component.
      }
      return;
    }
    if (!options.id || !isBrowser()) return;
    try {
      window.localStorage.setItem(options.id, JSON.stringify(toSave));
    } catch {
      // Quota / privacy mode — fail silently.
    }
  }, [options.id, options.storage]);

  const scheduleSave = useCallback(
    (sizes: Record<string, number>) => {
      pendingSaveRef.current = sizes;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        flushSave();
      }, debounceMs);
    },
    [debounceMs, flushSave]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      // Best-effort: write the most recent value synchronously on unmount
      // so a fast unmount after a drag doesn't drop the save.
      flushSave();
    };
  }, [flushSave]);

  const onSizesChange = useCallback(
    (sizes: Record<string, number>) => {
      currentSizesRef.current = sizes;
      scheduleSave(sizes);
    },
    [scheduleSave]
  );

  const setSizes = useCallback((sizes: Record<string, number>) => {
    layoutRef.current?.setSizes(sizes);
  }, []);

  const getSizes = useCallback(() => {
    return layoutRef.current?.getSizes() ?? currentSizesRef.current;
  }, []);

  const collapse = useCallback((paneId: string) => {
    layoutRef.current?.collapse(paneId);
  }, []);

  const expand = useCallback((paneId: string) => {
    layoutRef.current?.expand(paneId);
  }, []);

  const isCollapsed = useCallback((paneId: string) => {
    return layoutRef.current?.isCollapsed(paneId) ?? false;
  }, []);

  return {
    defaultSizes,
    onSizesChange,
    __layoutRef: layoutRef,
    setSizes,
    getSizes,
    collapse,
    expand,
    isCollapsed,
  };
};
