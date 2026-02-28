import { DetailPageSubtitleSlot } from "../detail-page.slots";
import type { DetailPageSubtitleProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

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
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageSubtitleSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </DetailPageSubtitleSlot>
  );
};

DetailPageSubtitle.displayName = "DetailPage.Subtitle";
