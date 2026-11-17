import { useMemo } from "react";
import { mergeRefs } from "@/utils";
import { DefaultPageContentSlot } from "../default-page.slots";
import { useDefaultPageContext } from "../default-page.context";
import type { DefaultPageContentProps } from "../default-page.types";

/**
 * DefaultPage.Content - The main content area of the default page.
 *
 * @supportsStyleProps
 */
export const DefaultPageContent = ({
  ref: forwardedRef,
  children,
  ...props
}: DefaultPageContentProps) => {
  const context = useDefaultPageContext();
  const isCollapseEnabled = context?.isCollapseEnabled ?? false;
  const registerContent = context?.registerContent;

  const ref = useMemo(
    () =>
      isCollapseEnabled && registerContent
        ? mergeRefs(forwardedRef, registerContent)
        : forwardedRef,
    [isCollapseEnabled, registerContent, forwardedRef]
  );

  return (
    <DefaultPageContentSlot ref={ref} tabIndex={0} {...props}>
      {children}
    </DefaultPageContentSlot>
  );
};

DefaultPageContent.displayName = "DefaultPage.Content";
