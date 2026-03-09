import { DetailPageSubtitleSlot } from "../detail-page.slots";
import type { DetailPageSubtitleProps } from "../detail-page.types";

/**
 * DetailPage.Subtitle - Optional subtitle text below the page title
 *
 * @supportsStyleProps
 */
export const DetailPageSubtitle = ({
  ref,
  children,
  ...props
}: DetailPageSubtitleProps) => {
  return (
    <DetailPageSubtitleSlot ref={ref} {...props}>
      {children}
    </DetailPageSubtitleSlot>
  );
};

DetailPageSubtitle.displayName = "DetailPage.Subtitle";
