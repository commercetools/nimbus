import { DetailPageContentSlot } from "../detail-page.slots";
import type { DetailPageContentProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

/**
 * DetailPage.Content - The main content area of the detail page.
 * Accepts a `variant` prop to control content width (wide, narrow, full).
 *
 * @supportsStyleProps
 */
export const DetailPageContent = ({
  ref,
  variant: _variant,
  children,
  ...props
}: DetailPageContentProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageContentSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </DetailPageContentSlot>
  );
};

DetailPageContent.displayName = "DetailPage.Content";
