import { useMemo, useState } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { mergeRefs } from "@/utils";
import { DefaultPageRootSlot } from "../default-page.slots";
import { DefaultPageContext } from "../default-page.context";
import {
  useCollapseHeaderOnScroll,
  useScrollDrivenHeader,
  useScrollDrivenSupport,
  useUnpinnedCollapseWarning,
} from "../hooks";
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

  // The header follows the scroll position where the browser supports
  // scroll-driven animations and the user does not prefer reduced motion.
  // Otherwise it changes in one step.
  const canScrollDrive = useScrollDrivenSupport();
  const isScrollDriven = isCollapseEnabled && canScrollDrive;

  // Set by the scroll-driven collapse while it measures a form of the header.
  const [measuredForm, setMeasuredForm] = useState<"full" | "collapsed" | null>(
    null
  );

  const { state: scrollDrivenState } = useScrollDrivenHeader({
    isEnabled: isScrollDriven,
    containerElement: rootElement,
    headerElement,
    contentElement,
    layout: layout === "flexible" ? "flexible" : "constrained",
    setMeasuredForm,
  });

  const { isCollapsed } = useCollapseHeaderOnScroll({
    isEnabled: isCollapseEnabled && !isScrollDriven,
    containerElement: rootElement,
    headerElement,
    contentElement,
    // The sticky header keeps its space, so nothing after it moves. In the
    // constrained layout, the content area gets the space back.
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
      isHeaderCollapsed: isScrollDriven
        ? scrollDrivenState === "pinned"
        : isCollapsed,
      isHeaderCollapseStarted: isScrollDriven
        ? scrollDrivenState !== "full"
        : isCollapsed,
      measuredForm,
      isScrollDriven,
      registerHeader: setHeaderElement,
      registerContent: setContentElement,
    }),
    [
      isCollapseEnabled,
      isCollapsed,
      isScrollDriven,
      scrollDrivenState,
      measuredForm,
    ]
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
