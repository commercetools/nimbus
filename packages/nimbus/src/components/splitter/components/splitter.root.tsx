import { useContext, useEffect, useId, useMemo, useRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { RegionProvider } from "../../region/region.provider";
import { createRegionPortal } from "../../region/region.portal";
import { SplitterRootSlot } from "../splitter.slots";
import { SplitterContext } from "../splitter.context";
import {
  createSplitterRegistry,
  SplitterRegistryContext,
} from "../splitter.registry";
import { SplitterHandleContext } from "../hooks/use-splitter";
import { useSplitterState } from "../hooks/use-splitter-state";
import { splitterRegionName } from "../utils/splitter-region-name";
import type {
  ResolvedAsideConfig,
  SplitterInstance,
  SplitterRootProps,
} from "../splitter.types";

/**
 * Splitter root container. Owns the single aside `size` and resolves
 * controlled/uncontrolled size + collapse. Wrap one `Splitter.Aside` and one
 * `Splitter.Main` with one `Splitter.Handle` between them (aside on either side).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @supportsStyleProps
 */
export const SplitterRoot = ({
  children,
  id,
  orientation = "horizontal",
  defaultSize,
  size,
  minSize,
  maxSize,
  collapsible,
  collapsedSize,
  onSizeChange,
  onSizeChangeEnd,
  collapsed,
  defaultCollapsed,
  onCollapsedChange,
  keyboardStep = 5,
  isDoubleClickDisabled = false,
  isDisabled = false,
  ref,
  ...props
}: SplitterRootProps) => {
  const recipe = useSlotRecipe({ key: "nimbusSplitter" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps({
    orientation,
    ...props,
  });
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  const asideConfig = useMemo<ResolvedAsideConfig>(
    () => ({
      minSize: minSize ?? 0,
      maxSize: maxSize ?? 100,
      collapsible: collapsible ?? false,
      collapsedSize: collapsedSize ?? 0,
    }),
    [minSize, maxSize, collapsible, collapsedSize]
  );

  // Resolved id: the explicit `id` names this splitter for `useSplitter(id)`;
  // absent that, a generated id still gives its panes unique region names so the
  // nearest `useSplitter()` can project into them.
  const reactId = useId();
  const splitterId = id ?? reactId;

  const contextValue = useSplitterState({
    orientation,
    defaultSize,
    size,
    asideConfig,
    collapsed,
    defaultCollapsed,
    keyboardStep,
    isDoubleClickDisabled,
    isDisabled,
    onSizeChange,
    onSizeChangeEnd,
    onCollapsedChange,
    splitterId,
  });

  // Stable portal components bound to this splitter's pane region names. Created
  // once so projecting content never tears the portaled subtree down on a
  // collapse/size change. They resolve the (shared) region registry from
  // context at their own render position — content placement is delegated to the
  // generic `Region` primitive; the Splitter only owns the names + collapse.
  const regionsRef = useRef<{
    MainRegion: SplitterInstance["MainRegion"];
    AsideRegion: SplitterInstance["AsideRegion"];
  } | null>(null);
  if (!regionsRef.current) {
    regionsRef.current = {
      MainRegion: createRegionPortal(splitterRegionName(splitterId, "main")),
      AsideRegion: createRegionPortal(splitterRegionName(splitterId, "aside")),
    };
  }

  // Stable collapse commands that always call the latest `setCollapsed` (whose
  // identity changes with `collapsed`) and read the latest `collapsed` value, so
  // the handle's command identities never change.
  const collapsedRef = useRef(contextValue.collapsed);
  collapsedRef.current = contextValue.collapsed;
  const setCollapsedRef = useRef(contextValue.setCollapsed);
  setCollapsedRef.current = contextValue.setCollapsed;
  const commandsRef = useRef<{
    expand: () => void;
    collapse: () => void;
    toggle: () => void;
  } | null>(null);
  if (!commandsRef.current) {
    commandsRef.current = {
      expand: () => setCollapsedRef.current(false),
      collapse: () => setCollapsedRef.current(true),
      toggle: () => setCollapsedRef.current(!collapsedRef.current),
    };
  }

  // The public handle. Memoized on `collapsed` alone (commands + regions are
  // stable refs), so it changes only when the aside collapses/expands — never on
  // a drag tick — keeping `useSplitter` consumers and the registry quiet.
  const handle = useMemo<SplitterInstance>(
    () => ({
      isCollapsed: contextValue.collapsed,
      expand: commandsRef.current!.expand,
      collapse: commandsRef.current!.collapse,
      toggle: commandsRef.current!.toggle,
      MainRegion: regionsRef.current!.MainRegion,
      AsideRegion: regionsRef.current!.AsideRegion,
    }),
    [contextValue.collapsed]
  );

  // The outermost Splitter.Root hosts the flat registry; nested ones reuse it.
  const parentRegistry = useContext(SplitterRegistryContext);
  const ownRegistryRef = useRef<ReturnType<
    typeof createSplitterRegistry
  > | null>(null);
  if (!parentRegistry && !ownRegistryRef.current) {
    ownRegistryRef.current = createSplitterRegistry();
  }
  const registry = parentRegistry ?? ownRegistryRef.current!;

  // Publish this instance under its `id` so `useSplitter(id)` can reach it from
  // anywhere. Only named splitters register. Re-runs when the handle changes
  // (i.e. on collapse), keeping registry subscribers current.
  useEffect(() => {
    if (!id) return;
    registry.register(id, handle);
    return () => registry.unregister(id);
  }, [id, registry, handle]);

  // Dev-time warning: the Splitter primitive is strictly aside + main. Evaluated
  // in an effect (not during render) so it fires after pane registration settles
  // — panes register via effects, so a transient 1-pane commit (StrictMode
  // double-invoke, staggered child mounts) is normal and must not warn.
  const paneCount = contextValue.paneOrder.length;
  useEffect(() => {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      paneCount > 0 &&
      paneCount !== 2
    ) {
      console.warn(
        `[Splitter] Expected one <Splitter.Aside> and one <Splitter.Main>, got ${paneCount} pane(s). The Splitter primitive is 2-pane; nest a second Splitter inside a pane for 3+ regions.`
      );
    }
  }, [paneCount]);

  const tree = (
    <SplitterContext.Provider value={contextValue}>
      <SplitterHandleContext.Provider value={handle}>
        {/* Region scope shared by this splitter's pane outlets and any consumer
            below — reuses an ancestor scope when splitters are nested. */}
        <RegionProvider>
          <SplitterRootSlot
            ref={ref}
            id={id}
            {...recipeProps}
            {...styleProps}
            {...restProps}
          >
            {children}
          </SplitterRootSlot>
        </RegionProvider>
      </SplitterHandleContext.Provider>
    </SplitterContext.Provider>
  );

  // Host the registry context only at the outermost Splitter.Root.
  return parentRegistry ? (
    tree
  ) : (
    <SplitterRegistryContext.Provider value={registry}>
      {tree}
    </SplitterRegistryContext.Provider>
  );
};

SplitterRoot.displayName = "Splitter.Root";
