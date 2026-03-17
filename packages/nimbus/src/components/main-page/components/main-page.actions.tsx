import { MainPageActionsSlot } from "../main-page.slots";
import type { MainPageActionsProps } from "../main-page.types";

/**
 * MainPage.Actions - Container for header action buttons.
 * Uses flex layout with gap between items.
 *
 * @supportsStyleProps
 */
export const MainPageActions = ({
  ref,
  children,
  ...props
}: MainPageActionsProps) => (
  <MainPageActionsSlot ref={ref} {...props}>
    {children}
  </MainPageActionsSlot>
);

MainPageActions.displayName = "MainPage.Actions";
