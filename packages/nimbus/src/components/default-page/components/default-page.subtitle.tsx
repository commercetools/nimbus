import { DefaultPageSubtitleSlot } from "../default-page.slots";
import type { DefaultPageSubtitleProps } from "../default-page.types";

/**
 * DefaultPage.Subtitle - Optional subtitle text below the page title
 *
 * @supportsStyleProps
 */
export const DefaultPageSubtitle = ({
  ref,
  children,
  ...props
}: DefaultPageSubtitleProps) => {
  return (
    <DefaultPageSubtitleSlot ref={ref} {...props}>
      {children}
    </DefaultPageSubtitleSlot>
  );
};

DefaultPageSubtitle.displayName = "DefaultPage.Subtitle";
