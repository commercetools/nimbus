import { DetailPageContentSlot } from "../detail-page.slots";
import type { DetailPageContentProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

/**
 * DetailPage.Content - The main content area of the detail page.
 *
 * @supportsStyleProps
 */
export const DetailPageContent = ({
  ref,
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
