import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { SplitterRootSlot } from "../splitter.slots";
import { SplitterContext } from "../splitter.context";
import { useSplitterState } from "../hooks/use-splitter-state";
import type { SplitterRootProps } from "../splitter.types";

/**
 * Splitter root container. Owns sizes state for the two child panes (via
 * `useSplitterState`), hosts the per-pane configuration map, and is the target
 * the persistence hook (`useSplitterLayout`) attaches its imperative ref to.
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

  const contextValue = useSplitterState({
    orientation,
    defaultSizes,
    panes,
    keyboardStep,
    disableDoubleClick,
    onSizesChange,
    onCollapse,
    onExpand,
    layoutRef: __layoutRef,
  });

  // Dev-time warning: the Splitter primitive is strictly 2-pane.
  if (process.env.NODE_ENV !== "production") {
    const paneCount = contextValue.paneOrder.length;
    if (paneCount > 0 && paneCount !== 2) {
      console.warn(
        `[Splitter] Expected exactly 2 <Splitter.Pane> children, got ${paneCount}. The Splitter primitive is 2-pane; nest a second Splitter inside a Pane for 3+ regions.`
      );
    }
  }

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
