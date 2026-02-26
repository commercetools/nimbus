import { MainPageTitleSlot } from "../main-page.slots";
import type { MainPageTitleProps } from "../main-page.types";

/**
 * MainPage.Title - The page title rendered as an h1. Accepts children
 * for full flexibility — pass a string for simple titles or custom
 * JSX for advanced use cases.
 *
 * @supportsStyleProps
 */
export const MainPageTitle = ({
  ref,
  children,
  ...props
}: MainPageTitleProps) => (
  <MainPageTitleSlot ref={ref} {...props}>
    {children}
  </MainPageTitleSlot>
);

MainPageTitle.displayName = "MainPage.Title";
