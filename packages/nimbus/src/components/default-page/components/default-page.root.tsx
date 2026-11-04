import { useMemo, useState } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { mergeRefs } from "@/utils";
import { DefaultPageRootSlot } from "../default-page.slots";
import { DefaultPageContext } from "../default-page.context";
import {
  useCollapseHeaderOnScroll,
  useScrollDrivenHeader,
  useUnpinnedCollapseWarning,
} from "../hooks";
import { supportsScrollDrivenHeader } from "../utils";
import type { DefaultPageProps } from "../default-page.types";

/**
 * DefaultPage.Root - The root container for the default page layout
 *
 * @supportsStyleProps
 */
export const DefaultPageRoot = ({
  ref: forwardedRef,
  children,
  ...props
}: DefaultPageProps) => {
  const recipe = useSlotRecipe({ key: "nimbusDefaultPage" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);
  const { layout, collapseHeaderOnScroll } = props;
  const stickyHeader =
    props.layout === "flexible" ? props.stickyHeader : undefined;

  useUnpinnedCollapseWarning({ collapseHeaderOnScroll, layout, stickyHeader });

  // The header is pinned by the grid in the constrained layout, and by
  // `position: sticky` in the flexible layout with `stickyHeader`.
  const isHeaderPinned = layout !== "flexible" || stickyHeader === true;
  const isCollapseEnabled = collapseHeaderOnScroll === true && isHeaderPinned;

  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [headerElement, setHeaderElement] = useState<HTMLElement | null>(null);
  const [contentElement, setContentElement] = useState<HTMLElement | null>(
    null
  );

  const ref = useMemo(
    () =>
      isCollapseEnabled
        ? mergeRefs(forwardedRef, setRootElement)
        : forwardedRef,
    [isCollapseEnabled, forwardedRef]
  );

  // EXPERIMENT ("scroll-driven", not public API): the sticky header follows
  // the scroll position. Without browser support or with reduced motion, the
  // regular behavior applies.
  const isScrollDriven =
    isCollapseEnabled &&
    layout === "flexible" &&
    (props as Record<string, unknown>)["data-header-collapse-mode"] ===
      "scroll-driven" &&
    supportsScrollDrivenHeader(typeof window === "undefined" ? null : window);

  const { isPinned } = useScrollDrivenHeader({
    isEnabled: isScrollDriven,
    containerElement: rootElement,
    headerElement,
  });

  const { isCollapsed } = useCollapseHeaderOnScroll({
    isEnabled: isCollapseEnabled && !isScrollDriven,
    containerElement: rootElement,
    headerElement,
    contentElement,
    // The sticky header keeps its space, so nothing after it moves and the
    // change can be animated. In the constrained layout, the content area
    // gets the space back.
    keepSpace: layout === "flexible",
  });

  // The collapse styles apply only when the header can collapse.
  const slotRecipeProps = {
    ...recipeProps,
    collapseHeaderOnScroll: isCollapseEnabled,
  };

  const context = useMemo(
    () => ({
      isCollapseEnabled,
      isHeaderCollapsed: isScrollDriven ? isPinned : isCollapsed,
      isScrollDriven,
      registerHeader: setHeaderElement,
      registerContent: setContentElement,
    }),
    [isCollapseEnabled, isCollapsed, isScrollDriven, isPinned]
  );

  return (
    <DefaultPageContext.Provider value={context}>
      <DefaultPageRootSlot ref={ref} {...slotRecipeProps} {...restProps}>
        {children}
      </DefaultPageRootSlot>
    </DefaultPageContext.Provider>
  );
};

DefaultPageRoot.displayName = "DefaultPage.Root";
