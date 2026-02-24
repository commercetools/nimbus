import { MainPageContentSlot } from "../main-page.slots";
import type { MainPageContentProps } from "../main-page.types";
import { PageContentRoot } from "../../page-content/components/page-content.root";

/**
 * MainPage.Content - The main content area that wraps PageContent.Root
 * internally. Forwards `variant` and `columns` props to PageContent for
 * width constraints and column layouts.
 *
 * @supportsStyleProps
 */
export const MainPageContent = ({
  ref,
  children,
  variant,
  columns,
  ...props
}: MainPageContentProps) => (
  <MainPageContentSlot ref={ref} {...props}>
    <PageContentRoot variant={variant} columns={columns}>
      {children}
    </PageContentRoot>
  </MainPageContentSlot>
);

MainPageContent.displayName = "MainPage.Content";
