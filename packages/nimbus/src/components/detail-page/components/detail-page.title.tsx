import { DetailPageTitleSlot } from "../detail-page.slots";
import type { DetailPageTitleProps } from "../detail-page.types";

/**
 * DetailPage.Title - The page title heading
 *
 * @supportsStyleProps
 */
export const DetailPageTitle = ({
  ref,
  children,
  ...props
}: DetailPageTitleProps) => {
  return (
    <DetailPageTitleSlot ref={ref} {...props}>
      {children}
    </DetailPageTitleSlot>
  );
};

DetailPageTitle.displayName = "DetailPage.Title";
