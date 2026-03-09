import { DetailPageHeaderActionsSlot } from "../detail-page.slots";
import type { DetailPageHeaderActionsProps } from "../detail-page.types";

/**
 * DetailPage.HeaderActions - Action buttons displayed alongside the title
 *
 * @supportsStyleProps
 */
export const DetailPageHeaderActions = ({
  ref,
  children,
  ...props
}: DetailPageHeaderActionsProps) => {
  return (
    <DetailPageHeaderActionsSlot ref={ref} {...props}>
      {children}
    </DetailPageHeaderActionsSlot>
  );
};

DetailPageHeaderActions.displayName = "DetailPage.HeaderActions";
