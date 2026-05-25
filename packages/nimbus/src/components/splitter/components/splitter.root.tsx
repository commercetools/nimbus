import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { SplitterRootSlot } from "../splitter.slots";
import { SplitterContext } from "./splitter.context";
import type { SplitterContextValue } from "./splitter.context";
import type {
  SplitterImperativeHandle,
  SplitterPaneConfig,
  SplitterRootProps,
} from "../splitter.types";

const SUM_TOLERANCE = 0.001;

/**
 * Build the initial sizes record from defaults. Preference order:
 *   1. Explicit `defaultSizes` (validated for both pane ids).
 *   2. Per-pane `panes[id].defaultSize` (normalized to sum to 100).
 *   3. Equal split (50/50) across the two panes.
 */
const deriveInitialSizes = (
  paneIds: string[],
  defaultSizes: Record<string, number> | undefined,
  panes: Record<string, SplitterPaneConfig> | undefined
): Record<string, number> => {
  if (paneIds.length === 0) return {};
  if (paneIds.length === 1) return { [paneIds[0]!]: 100 };

  if (defaultSizes) {
    const present = paneIds.every((id) => typeof defaultSizes[id] === "number");
    if (present) {
      const sum = paneIds.reduce((acc, id) => acc + defaultSizes[id]!, 0);
      if (sum > 0 && Math.abs(sum - 100) < 5) {
        // Normalize floating-point drift to exactly 100.
        return Object.fromEntries(
          paneIds.map((id) => [id, (defaultSizes[id]! / sum) * 100])
        );
      }
    }
  }

  const fromPanes = paneIds.map((id) => panes?.[id]?.defaultSize);
  const allDefined = fromPanes.every((s) => typeof s === "number");
  if (allDefined) {
    const sum = fromPanes.reduce<number>((acc, s) => acc + (s as number), 0);
    if (sum > 0) {
      return Object.fromEntries(
        paneIds.map((id, i) => [id, ((fromPanes[i] as number) / sum) * 100])
      );
    }
  }

  const share = 100 / paneIds.length;
  return Object.fromEntries(paneIds.map((id) => [id, share]));
};

/**
 * Splitter root container. Owns sizes state for the two child panes, hosts
 * the per-pane configuration map, and is the target the persistence hook
 * (`useSplitterLayout`) attaches its imperative ref to.
 *
 * Children MUST consist of exactly two `<Splitter.Pane>` elements with one
 * `<Splitter.Handle>` between them. The component renders best-effort on
 * malformed children and emits a development-time warning.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 */
export const SplitterRoot = ({
  children,
  orientation = "horizontal",
  defaultSizes,
  onSizesChange,
  panes,
  keyboardStep = 5,
  disableDoubleClick = false,
  onCollapse,
  onExpand,
  __layoutRef,
  ref,
  ...props
}: SplitterRootProps) => {
  const recipe = useSlotRecipe({ key: "nimbusSplitter" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps({
    orientation,
    ...props,
  });
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  // Pane registration: pane order in DOM, and the DOM id rendered on each.
  const [paneOrder, setPaneOrder] = useState<string[]>([]);
  const [paneDomIds, setPaneDomIds] = useState<Record<string, string>>({});

  // Sizes state. We initialize lazily once both panes have registered so the
  // initial-sizes derivation has the right ids; intermediate renders return
  // empty sizes (panes fall back to 0%) — this happens for at most one paint.
  const [sizes, setSizesState] = useState<Record<string, number>>({});

  // Re-run initial sizes derivation when the pane set changes (mount).
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (paneOrder.length === 2 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setSizesState(deriveInitialSizes(paneOrder, defaultSizes, panes));
    }
    // Defaults are read once on mount, per spec — don't react to changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paneOrder]);

  // Track collapsed state per pane so onCollapse/onExpand fire on transitions.
  const collapsedRef = useRef<Record<string, boolean>>({});

  const setSizes = useCallback(
    (next: Record<string, number>) => {
      const prevSizes = sizes;
      setSizesState(next);

      // Detect collapse/expand transitions and fire callbacks once per change.
      for (const id of Object.keys(next)) {
        const cfg = panes?.[id];
        if (!cfg?.collapsible) continue;
        const collapsedSize = cfg.collapsedSize ?? 0;
        const wasCollapsed =
          collapsedRef.current[id] ??
          (prevSizes[id] !== undefined &&
            prevSizes[id]! <= collapsedSize + SUM_TOLERANCE);
        const isNowCollapsed = next[id]! <= collapsedSize + SUM_TOLERANCE;
        if (!wasCollapsed && isNowCollapsed) {
          onCollapse?.(id);
        } else if (wasCollapsed && !isNowCollapsed) {
          onExpand?.(id);
        }
        collapsedRef.current[id] = isNowCollapsed;
      }

      onSizesChange?.(next);
    },
    [sizes, panes, onSizesChange, onCollapse, onExpand]
  );

  const registerPane = useCallback((paneId: string, domId: string) => {
    setPaneOrder((order) =>
      order.includes(paneId) ? order : [...order, paneId]
    );
    setPaneDomIds((map) =>
      map[paneId] === domId ? map : { ...map, [paneId]: domId }
    );
  }, []);

  const unregisterPane = useCallback((paneId: string) => {
    setPaneOrder((order) => order.filter((id) => id !== paneId));
    setPaneDomIds((map) => {
      if (!(paneId in map)) return map;
      const next = { ...map };
      delete next[paneId];
      return next;
    });
  }, []);

  const getPaneConfig = useCallback(
    (paneId: string): SplitterPaneConfig => panes?.[paneId] ?? {},
    [panes]
  );

  const isCollapsedFn = useCallback(
    (paneId: string): boolean => {
      const cfg = panes?.[paneId];
      if (!cfg?.collapsible) return false;
      const collapsedSize = cfg.collapsedSize ?? 0;
      return (sizes[paneId] ?? 0) <= collapsedSize + SUM_TOLERANCE;
    },
    [panes, sizes]
  );

  const collapsePane = useCallback(
    (paneId: string) => {
      if (paneOrder.length !== 2) return;
      const otherId = paneOrder.find((id) => id !== paneId);
      if (!otherId) return;
      const cfg = panes?.[paneId];
      if (!cfg?.collapsible) return;
      const collapsedSize = cfg.collapsedSize ?? 0;
      const otherCfg = panes?.[otherId];
      const otherMax = otherCfg?.maxSize ?? 100;
      const otherSize = Math.min(100 - collapsedSize, otherMax);
      setSizes({ [paneId]: 100 - otherSize, [otherId]: otherSize });
    },
    [paneOrder, panes, setSizes]
  );

  const expandPane = useCallback(
    (paneId: string) => {
      if (paneOrder.length !== 2) return;
      const otherId = paneOrder.find((id) => id !== paneId);
      if (!otherId) return;
      const cfg = panes?.[paneId];
      const restoreTo =
        cfg?.defaultSize ?? defaultSizes?.[paneId] ?? 100 / paneOrder.length;
      setSizes({ [paneId]: restoreTo, [otherId]: 100 - restoreTo });
    },
    [paneOrder, panes, defaultSizes, setSizes]
  );

  // Expose imperative commands to `useSplitterLayout` via the internal ref.
  useImperativeHandle(
    __layoutRef,
    (): SplitterImperativeHandle => ({
      setSizes,
      getSizes: () => sizes,
      collapse: collapsePane,
      expand: expandPane,
      isCollapsed: isCollapsedFn,
    }),
    [setSizes, sizes, collapsePane, expandPane, isCollapsedFn]
  );

  // Dev-time warnings: pane count, missing/duplicate ids.
  if (process.env.NODE_ENV !== "production") {
    if (paneOrder.length > 0 && paneOrder.length !== 2) {
      console.warn(
        `[Splitter] Expected exactly 2 <Splitter.Pane> children, got ${paneOrder.length}. The Splitter primitive is 2-pane; nest a second Splitter inside a Pane for 3+ regions.`
      );
    }
  }

  const contextValue = useMemo<SplitterContextValue>(
    () => ({
      sizes,
      setSizes,
      orientation,
      keyboardStep,
      disableDoubleClick,
      getPaneConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsePane,
      expandPane,
      isCollapsed: isCollapsedFn,
    }),
    [
      sizes,
      setSizes,
      orientation,
      keyboardStep,
      disableDoubleClick,
      getPaneConfig,
      paneOrder,
      paneDomIds,
      registerPane,
      unregisterPane,
      collapsePane,
      expandPane,
      isCollapsedFn,
    ]
  );

  return (
    <SplitterContext.Provider value={contextValue}>
      <SplitterRootSlot
        ref={ref}
        {...recipeProps}
        {...styleProps}
        {...restProps}
      >
        {children}
      </SplitterRootSlot>
    </SplitterContext.Provider>
  );
};

SplitterRoot.displayName = "Splitter.Root";
