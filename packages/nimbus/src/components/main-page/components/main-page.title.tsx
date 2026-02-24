import { MainPageTitleSlot } from "../main-page.slots";
import type { MainPageTitleProps } from "../main-page.types";

/**
 * MainPage.Title - The page title, rendered as an h1 element.
 * Consumers can override the element with Chakra's `as` prop if needed.
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
