import { DetailPageHeaderSlot } from "../detail-page.slots";
import type { DetailPageHeaderProps } from "../detail-page.types";

/**
 * DetailPage.Header - The header section containing back link, title, and subtitle
 *
 * @supportsStyleProps
 */
export const DetailPageHeader = ({
  ref,
  children,
  ...props
}: DetailPageHeaderProps) => {
  return (
    <DetailPageHeaderSlot ref={ref} {...props}>
      {children}
    </DetailPageHeaderSlot>
  );
};

DetailPageHeader.displayName = "DetailPage.Header";
