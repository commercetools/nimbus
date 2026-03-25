import { DefaultPageActionsSlot } from "../default-page.slots";
import type { DefaultPageActionsProps } from "../default-page.types";

/**
 * DefaultPage.Actions - Action buttons displayed alongside the title
 *
 * @supportsStyleProps
 */
export const DefaultPageActions = ({
  ref,
  children,
  ...props
}: DefaultPageActionsProps) => {
  return (
    <DefaultPageActionsSlot ref={ref} {...props}>
      {children}
    </DefaultPageActionsSlot>
  );
};

DefaultPageActions.displayName = "DefaultPage.Actions";
