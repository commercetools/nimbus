import { useEffect } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { SplitterRootSlot } from "../splitter.slots";
import { SplitterContext } from "../splitter.context";
import { useSplitterState } from "../hooks/use-splitter-state";
import type { SplitterRootProps } from "../splitter.types";

/**
 * Splitter root container. Owns sizes state for the two child panes (via
 * `useSplitterState`), hosts the per-pane configuration map, and resolves
 * controlled/uncontrolled collapse. Persistence is consumer-wired through
 * `defaultSizes` + `onSizesChangeEnd` and the controlled `collapsedPane` prop.
 *
 * Children MUST consist of exactly two `<Splitter.Pane>` elements with one
 * `<Splitter.Handle>` between them. The component renders best-effort on
 * malformed children and emits a development-time warning.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @supportsStyleProps
 */
export const SplitterRoot = ({
  children,
  orientation = "horizontal",
  defaultSizes,
  onSizesChange,
  onSizesChangeEnd,
  panes,
  collapsedPane,
  defaultCollapsedPane,
  onCollapsedPaneChange,
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

  const contextValue = useSplitterState({
    orientation,
    defaultSizes,
    panes,
    collapsedPane,
    defaultCollapsedPane,
    keyboardStep,
    isDoubleClickDisabled,
    isDisabled,
    onSizesChange,
    onSizesChangeEnd,
    onCollapsedPaneChange,
  });

  // Dev-time warning: the Splitter primitive is strictly 2-pane. Evaluated in
  // an effect (not during render) so it fires after pane registration settles —
  // panes register via effects, so a transient 1-pane commit (StrictMode
  // double-invoke, staggered child mounts) is normal and must not warn.
  const paneCount = contextValue.paneOrder.length;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (paneCount > 0 && paneCount !== 2) {
      console.warn(
        `[Splitter] Expected exactly 2 <Splitter.Pane> children, got ${paneCount}. The Splitter primitive is 2-pane; nest a second Splitter inside a Pane for 3+ regions.`
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
