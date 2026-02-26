import { MainPageSubtitleSlot } from "../main-page.slots";
import type { MainPageSubtitleProps } from "../main-page.types";

/**
 * MainPage.Subtitle - Optional subtitle text displayed below the title.
 * Accepts children for full flexibility.
 *
 * @supportsStyleProps
 */
export const MainPageSubtitle = ({
  ref,
  children,
  ...props
}: MainPageSubtitleProps) => (
  <MainPageSubtitleSlot ref={ref} {...props}>
    {children}
  </MainPageSubtitleSlot>
);

MainPageSubtitle.displayName = "MainPage.Subtitle";
