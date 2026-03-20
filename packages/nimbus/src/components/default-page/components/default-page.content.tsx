import { DefaultPageContentSlot } from "../default-page.slots";
import type { DefaultPageContentProps } from "../default-page.types";

/**
 * DefaultPage.Content - The main content area of the default page.
 *
 * @supportsStyleProps
 */
export const DefaultPageContent = ({
  ref,
  children,
  ...props
}: DefaultPageContentProps) => {
  return (
    <DefaultPageContentSlot ref={ref} {...props}>
      {children}
    </DefaultPageContentSlot>
  );
};

DefaultPageContent.displayName = "DefaultPage.Content";
