import { DefaultPageFooterSlot } from "../default-page.slots";
import type { DefaultPageFooterProps } from "../default-page.types";

/**
 * DefaultPage.Footer - Optional footer section, typically for form actions
 *
 * @supportsStyleProps
 */
export const DefaultPageFooter = ({
  ref,
  children,
  ...props
}: DefaultPageFooterProps) => {
  return (
    <DefaultPageFooterSlot ref={ref} {...props}>
      {children}
    </DefaultPageFooterSlot>
  );
};

DefaultPageFooter.displayName = "DefaultPage.Footer";
