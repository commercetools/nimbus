import { DetailPageHeaderSlot } from "../detail-page.slots";
import type { DetailPageHeaderProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

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
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageHeaderSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </DetailPageHeaderSlot>
  );
};

DetailPageHeader.displayName = "DetailPage.Header";
