import { DetailPageFooterSlot } from "../detail-page.slots";
import type { DetailPageFooterProps } from "../detail-page.types";

/**
 * DetailPage.Footer - Optional footer section, typically for form actions
 *
 * @supportsStyleProps
 */
export const DetailPageFooter = ({
  ref,
  children,
  ...props
}: DetailPageFooterProps) => {
  return (
    <DetailPageFooterSlot ref={ref} {...props}>
      {children}
    </DetailPageFooterSlot>
  );
};

DetailPageFooter.displayName = "DetailPage.Footer";
