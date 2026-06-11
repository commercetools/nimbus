import { useEffect, useMemo } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { SplitterRootSlot } from "../splitter.slots";
import { SplitterContext } from "../splitter.context";
import { useSplitterState } from "../hooks/use-splitter-state";
import type { ResolvedAsideConfig, SplitterRootProps } from "../splitter.types";

declare const process: { env: Record<string, string | undefined> } | undefined;

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
  });

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
