import { DefaultPageTitleSlot } from "../default-page.slots";
import type { DefaultPageTitleProps } from "../default-page.types";

/**
 * DefaultPage.Title - The page title heading
 *
 * @supportsStyleProps
 */
export const DefaultPageTitle = ({
  ref,
  children,
  ...props
}: DefaultPageTitleProps) => {
  return (
    <DefaultPageTitleSlot ref={ref} {...props}>
      {children}
    </DefaultPageTitleSlot>
  );
};

DefaultPageTitle.displayName = "DefaultPage.Title";
