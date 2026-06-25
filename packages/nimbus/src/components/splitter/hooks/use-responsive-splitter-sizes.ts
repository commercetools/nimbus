import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ResponsiveSplitterRootProps,
  UseResponsiveSplitterSizesOptions,
  UseResponsiveSplitterSizesResult,
} from "../splitter.types";
import {
  bandValueAt,
  clampPercent,
  isPercentValue,
  percentToPx,
  resolveDimension,
  type StoredBand,
} from "../utils/responsive-size";
import {
  createLocalStorageAdapter,
  parseStoredBands,
  serializeStoredBands,
} from "../utils/responsive-size-storage";

/**
 * Emitted `size` only changes when it moves by more than this many percentage
 * points — coarser than the component's internal `1e-6` epsilon so pixel↔percent
 * round-trips under `ResizeObserver` ticks don't thrash the controlled prop.
 */
const EMIT_TOLERANCE = 0.05;
/** Ignore sub-pixel measurement noise. */
const MEASURE_TOLERANCE = 0.5;
/** Hysteresis deadband (px) around band thresholds. */
const BAND_DEADBAND = 2;

/** Module-level default so the adapter identity is stable across renders. */
const defaultStorage = createLocalStorageAdapter();

/**
 * Translate a pixel-/token-/percent size config — optionally responsive by
 * container width — into the percentage `Splitter.Root` consumes, returning
 * `rootProps` to spread onto the root.
 *
 * The hook is the **pixel/token → percentage translator** the component
 * deliberately omits: `Splitter.Root` stays percentage-native; all pixel math,
 * container-width resolution, hook-side clamping, and per-band persistence live
 * here. It drives the component's settle-only controlled `size` channel and
 * feeds the settled value back, so the controlled loop stays closed with no
 * snap-back. A bare `number` is **always pixels**.
 *
 * @example
 * const { rootProps } = useResponsiveSplitterSizes({
 *   orientation: "horizontal",
 *   persistKey: "app:main-splitter",
 *   size: { 0: 320, 768: "30%" }, // 320px below 768px container width, 30% above
 * });
 * return (
 *   <Splitter.Root {...rootProps} collapsible>
 *     <Splitter.Aside>…</Splitter.Aside>
 *     <Splitter.Handle />
 *     <Splitter.Main>…</Splitter.Main>
 *   </Splitter.Root>
 * );
 */
export const useResponsiveSplitterSizes = (
  options: UseResponsiveSplitterSizesOptions
): UseResponsiveSplitterSizesResult => {
  const {
    orientation = "horizontal",
    size,
    minSize,
    maxSize,
    collapsedSize,
    persistKey,
    storage = defaultStorage,
    onCollapsedChange,
  } = options;

  // Latest measured container size on the relevant axis (null until observed).
  const [measured, setMeasured] = useState<number | null>(null);
  const measuredRef = useRef<number | null>(null);

  // Persisted bands for the size dimension, keyed by resolved px threshold.
  const [storedBands, setStoredBands] = useState<Record<number, StoredBand>>(
    () =>
      persistKey ? (parseStoredBands(storage.getItem(persistKey)) ?? {}) : {}
  );
  const storedBandsRef = useRef(storedBands);
  storedBandsRef.current = storedBands;

  // Hysteresis: the band the size dimension currently resolves to.
  const activeThresholdRef = useRef<number | null>(null);
  // Gate for the emitted controlled size.
  const lastEmittedRef = useRef<number | null>(null);
  const [emittedSize, setEmittedSize] = useState<number | undefined>(undefined);
  // Whether the aside is currently collapsed (so settles aren't persisted).
  const collapsedRef = useRef(false);

  // Latest config snapshot for the (stable) settle handler.
  const latestRef = useRef({ size, persistKey, onCollapsedChange });
  latestRef.current = { size, persistKey, onCollapsedChange };

  // --- Resolution (recomputed each render; cheap + pure) ---------------------
  const sizeRes = resolveDimension(size, measured, {
    activeThresholdPx: activeThresholdRef.current,
    deadbandPx: BAND_DEADBAND,
    stored: storedBands,
  });
  const minPct =
    minSize !== undefined
      ? (resolveDimension(minSize, measured).percent ?? undefined)
      : undefined;
  const maxPct =
    maxSize !== undefined
      ? (resolveDimension(maxSize, measured).percent ?? undefined)
      : undefined;
  const collapsedPct =
    collapsedSize !== undefined
      ? (resolveDimension(collapsedSize, measured).percent ?? undefined)
      : undefined;

  const targetSize =
    sizeRes.percent === null
      ? null
      : clampPercent(sizeRes.percent, minPct ?? 0, maxPct ?? 100);

  // Commit the active band + gated emitted size after render (never during).
  useEffect(() => {
    if (sizeRes.thresholdPx !== null) {
      activeThresholdRef.current = sizeRes.thresholdPx;
    }
    if (targetSize === null) return;
    if (
      lastEmittedRef.current !== null &&
      Math.abs(targetSize - lastEmittedRef.current) < EMIT_TOLERANCE
    ) {
      return;
    }
    lastEmittedRef.current = targetSize;
    setEmittedSize(targetSize);
  }, [targetSize, sizeRes.thresholdPx]);

  // --- Container measurement (ResizeObserver) --------------------------------
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const read = (width: number, height: number) => {
        const next = orientation === "vertical" ? height : width;
        if (!Number.isFinite(next) || next <= 0) return;
        measuredRef.current = next;
        setMeasured((prev) =>
          prev !== null && Math.abs(prev - next) < MEASURE_TOLERANCE
            ? prev
            : next
        );
      };

      // Synchronous one-shot measurement on attach. The ref callback runs during
      // the commit phase, before the browser paints, so reading the box here lets
      // a pixel/token config resolve to its percentage before the first paint —
      // no 50/50 flash. `read` ignores non-positive sizes, so a detached/zero-box
      // node is a safe no-op. %-only configs resolve synchronously regardless.
      const rect = node.getBoundingClientRect();
      read(rect.width, rect.height);

      if (typeof ResizeObserver === "undefined") {
        // No observer (SSR/older runtimes): the one-shot read above is the only
        // measurement we get; subsequent container resizes won't be tracked.
        return;
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        read(entry.contentRect.width, entry.contentRect.height);
      });
      observer.observe(node);
      return () => observer.disconnect();
    },
    [orientation]
  );

  // --- Settle handler: persist (unless collapsed) + feed value back ----------
  const handleSizeChangeEnd = useCallback(
    (settledPct: number) => {
      // Collapse fires `onCollapsedChange(true)` before this settle, so a
      // collapse-driven settle is suppressed here: no feedback (keep the
      // controlled value at the expanded size, which becomes the expand target)
      // and no persistence.
      if (collapsedRef.current) return;

      lastEmittedRef.current = settledPct;
      setEmittedSize(settledPct);

      const { size: sizeCfg, persistKey: key } = latestRef.current;
      const containerPx = measuredRef.current;
      if (!key || containerPx === null || containerPx <= 0) return;

      const { thresholdPx } = resolveDimension(sizeCfg, containerPx, {
        activeThresholdPx: activeThresholdRef.current,
        deadbandPx: BAND_DEADBAND,
      });
      if (thresholdPx === null) return;

      const configured = bandValueAt(sizeCfg, thresholdPx);
      const unit: StoredBand["unit"] = isPercentValue(configured)
        ? "pct"
        : "px";
      const value =
        unit === "pct" ? settledPct : percentToPx(settledPct, containerPx);

      const nextBands = {
        ...storedBandsRef.current,
        [thresholdPx]: { unit, value },
      };
      storedBandsRef.current = nextBands;
      setStoredBands(nextBands);
      try {
        storage.setItem(key, serializeStoredBands(nextBands));
      } catch {
        // Best-effort; resolution still works from in-memory state.
      }
    },
    [storage]
  );

  const handleCollapsedChange = useCallback((collapsed: boolean) => {
    collapsedRef.current = collapsed;
    latestRef.current.onCollapsedChange?.(collapsed);
  }, []);

  // Prefer the gated `emittedSize` (stable across sub-tolerance resize ticks),
  // but fall back to the freshly-resolved `targetSize` before the gate's effect
  // first runs. This is what makes a synchronously-resolvable config (e.g. a
  // `%` value, which needs no measurement) drive the controlled `size` on the
  // very first render — so the component honors it on first paint with no flash,
  // rather than briefly showing its uncontrolled default.
  const resolvedSize = emittedSize ?? targetSize ?? undefined;

  const rootProps = useMemo<ResponsiveSplitterRootProps>(() => {
    const props: ResponsiveSplitterRootProps = {
      ref,
      orientation,
      onSizeChangeEnd: handleSizeChangeEnd,
      onCollapsedChange: handleCollapsedChange,
    };
    if (resolvedSize !== undefined) props.size = resolvedSize;
    if (minPct !== undefined) props.minSize = minPct;
    if (maxPct !== undefined) props.maxSize = maxPct;
    if (collapsedPct !== undefined) props.collapsedSize = collapsedPct;
    return props;
  }, [
    ref,
    orientation,
    handleSizeChangeEnd,
    handleCollapsedChange,
    resolvedSize,
    minPct,
    maxPct,
    collapsedPct,
  ]);

  return { rootProps };
};
