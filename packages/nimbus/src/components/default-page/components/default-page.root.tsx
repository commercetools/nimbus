import { useMemo, useState } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { mergeRefs } from "@/utils";
import { DefaultPageRootSlot } from "../default-page.slots";
import { DefaultPageContext } from "../default-page.context";
import {
  useCollapseHeaderOnScroll,
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

  const { isCollapsed } = useCollapseHeaderOnScroll({
    isEnabled: isCollapseEnabled,
    containerElement: rootElement,
    headerElement,
    contentElement,
  });

  // The collapse styles apply only when the header can collapse.
  const slotRecipeProps = {
    ...recipeProps,
    collapseHeaderOnScroll: isCollapseEnabled,
  };

  const context = useMemo(
    () => ({
      isCollapseEnabled,
      isHeaderCollapsed: isCollapsed,
      registerHeader: setHeaderElement,
      registerContent: setContentElement,
    }),
    [isCollapseEnabled, isCollapsed]
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
