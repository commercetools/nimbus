import { DetailPageTitleSlot } from "../detail-page.slots";
import type { DetailPageTitleProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

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
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageTitleSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </DetailPageTitleSlot>
  );
};

DetailPageTitle.displayName = "DetailPage.Title";
