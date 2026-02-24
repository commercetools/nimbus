import { MainPageHeaderSlot } from "../main-page.slots";
import type { MainPageHeaderProps } from "../main-page.types";

/**
 * MainPage.Header - The header section with title and actions area.
 * Uses flex layout with space-between to position title on the left
 * and actions on the right.
 *
 * @supportsStyleProps
 */
export const MainPageHeader = ({
  ref,
  children,
  ...props
}: MainPageHeaderProps) => (
  <MainPageHeaderSlot ref={ref} {...props}>
    {children}
  </MainPageHeaderSlot>
);

MainPageHeader.displayName = "MainPage.Header";
