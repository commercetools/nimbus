import { DetailPageFooterSlot } from "../detail-page.slots";
import type { DetailPageFooterProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

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
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageFooterSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </DetailPageFooterSlot>
  );
};

DetailPageFooter.displayName = "DetailPage.Footer";
