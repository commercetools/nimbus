import { MainPageContentSlot } from "../main-page.slots";
import type { MainPageContentProps } from "../main-page.types";

/**
 * MainPage.Content - The main content area with scrollable overflow and
 * margin-based spacing. Uses margin (not padding) to preserve sticky
 * positioning behavior for child components like DataTable.
 *
 * @supportsStyleProps
 */
export const MainPageContent = ({
  ref,
  children,
  ...props
}: MainPageContentProps) => (
  <MainPageContentSlot ref={ref} {...props}>
    {children}
  </MainPageContentSlot>
);

MainPageContent.displayName = "MainPage.Content";
