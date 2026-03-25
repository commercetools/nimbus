import { DefaultPageHeaderSlot } from "../default-page.slots";
import type { DefaultPageHeaderProps } from "../default-page.types";

/**
 * DefaultPage.Header - The header section containing back link, title, and subtitle
 *
 * @supportsStyleProps
 */
export const DefaultPageHeader = ({
  ref,
  children,
  ...props
}: DefaultPageHeaderProps) => {
  return (
    <DefaultPageHeaderSlot ref={ref} {...props}>
      {children}
    </DefaultPageHeaderSlot>
  );
};

DefaultPageHeader.displayName = "DefaultPage.Header";
