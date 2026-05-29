import { useCallback, useEffect, useMemo, useRef } from "react";
import type { SplitterImperativeHandle } from "../splitter.types";

const DEFAULT_DEBOUNCE_MS = 200;
const NORMALIZATION_TOLERANCE = 1; // ±1% sum drift

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

/**
 * Reconcile a stored sizes record against the consumer's `initialSizes`:
 *   - Drop ids that aren't in `initialSizes`.
 *   - Fall back to `initialSizes[id]` for any id missing from storage.
 *   - Normalize within ±1% sum drift; bail to `initialSizes` if further out.
 *   - Log a development-only warning when reconciliation alters the stored
 *     record.
 */
const reconcileStored = (
  stored: Record<string, number> | undefined,
  initialSizes: Record<string, number>
): Record<string, number> => {
  if (!stored) return initialSizes;
  const initialIds = Object.keys(initialSizes);
  const storedIds = Object.keys(stored);
  const knownStored: Record<string, number> = {};
  for (const id of initialIds) {
    if (typeof stored[id] === "number" && Number.isFinite(stored[id])) {
      knownStored[id] = stored[id]!;
    } else {
      knownStored[id] = initialSizes[id]!;
    }
  }
  const droppedUnknown = storedIds.some((id) => !(id in initialSizes));
  const missingFilledIn = initialIds.some(
    (id) => typeof stored[id] !== "number"
  );
  const idsDiffer = droppedUnknown || missingFilledIn;
  const sum = Object.values(knownStored).reduce((a, b) => a + b, 0);
  if (sum <= 0) return initialSizes;
  const drift = Math.abs(sum - 100);
  // When ids differ between storage and initialSizes (renamed/dropped/added
  // pane between releases), normalize unconditionally — the stored values
  // are still meaningful relative to each other. When ids match exactly,
  // only normalize within ±1% drift; larger drift implies the stored value
  // is corrupted and we should fall back to initialSizes.
  if (!idsDiffer && drift > NORMALIZATION_TOLERANCE) return initialSizes;
  // Normalize to exactly 100.
  const normalized = Object.fromEntries(
    Object.entries(knownStored).map(([id, v]) => [id, (v / sum) * 100])
  );
  if (process.env.NODE_ENV !== "production") {
    if (droppedUnknown || missingFilledIn || drift > 0) {
      console.warn(
        "[Splitter] Reconciled stored layout against initial sizes (dropped unknown ids, filled defaults, or normalized sum)."
      );
    }
  }
  return normalized;
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
