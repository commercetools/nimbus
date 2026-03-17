import { MainPageFooterSlot } from "../main-page.slots";
import type { MainPageFooterProps } from "../main-page.types";

/**
 * MainPage.Footer - Optional footer for page-level actions.
 * Typically contains FormActionBar or custom button arrangements.
 * Omit this component for info/read-only pages.
 *
 * @supportsStyleProps
 */
export const MainPageFooter = ({
  ref,
  children,
  ...props
}: MainPageFooterProps) => (
  <MainPageFooterSlot ref={ref} {...props}>
    {children}
  </MainPageFooterSlot>
);

MainPageFooter.displayName = "MainPage.Footer";
