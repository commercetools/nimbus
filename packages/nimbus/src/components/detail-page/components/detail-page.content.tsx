import { DetailPageContentSlot } from "../detail-page.slots";
import type { DetailPageContentProps } from "../detail-page.types";

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
  return (
    <DetailPageContentSlot ref={ref} {...props}>
      {children}
    </DetailPageContentSlot>
  );
};

DetailPageContent.displayName = "DetailPage.Content";
