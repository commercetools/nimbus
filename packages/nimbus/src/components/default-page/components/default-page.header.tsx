import { useMemo } from "react";
import { mergeRefs } from "@/utils";
import { DefaultPageHeaderSlot } from "../default-page.slots";
import { useDefaultPageContext } from "../default-page.context";
import type { DefaultPageHeaderProps } from "../default-page.types";

/**
 * DefaultPage.Header - The header section containing back link, title, and subtitle
 *
 * With `collapseHeaderOnScroll` on `DefaultPage.Root`, the children can be a
 * function that receives `{ isCollapsed }`, to adapt page-owned header
 * content to the header state.
 *
 * @supportsStyleProps
 */
export const DefaultPageHeader = ({
  ref: forwardedRef,
  children,
  ...props
}: DefaultPageHeaderProps) => {
  const context = useDefaultPageContext();
  const isCollapseEnabled = context?.isCollapseEnabled ?? false;
  const registerHeader = context?.registerHeader;

  const ref = useMemo(
    () =>
      isCollapseEnabled && registerHeader
        ? mergeRefs(forwardedRef, registerHeader)
        : forwardedRef,
    [isCollapseEnabled, registerHeader, forwardedRef]
  );

  return (
    <DefaultPageHeaderSlot
      ref={ref}
      {...props}
      data-collapsed={
        context?.isHeaderCollapsed && !context.isScrollDriven
          ? "true"
          : undefined
      }
      // EXPERIMENT ("scroll-driven"): the pinned collapsed form.
      data-scroll-collapsed={
        context?.isHeaderCollapsed && context.isScrollDriven
          ? "true"
          : undefined
      }
    >
      {typeof children === "function"
        ? children({ isCollapsed: context?.isHeaderCollapseStarted ?? false })
        : children}
    </DefaultPageHeaderSlot>
  );
};

DefaultPageHeader.displayName = "DefaultPage.Header";
