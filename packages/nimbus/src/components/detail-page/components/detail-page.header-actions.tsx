import { DetailPageHeaderActionsSlot } from "../detail-page.slots";
import type { DetailPageHeaderActionsProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

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
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageHeaderActionsSlot ref={ref} {...styleProps} {...functionalProps}>
      {children}
    </DetailPageHeaderActionsSlot>
  );
};

DetailPageHeaderActions.displayName = "DetailPage.HeaderActions";
