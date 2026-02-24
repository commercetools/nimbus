import { Heading } from "../../heading/heading";
import { Text } from "../../text/text";
import type { MainPageTitleProps } from "../main-page.types";

/**
 * MainPage.Title - The page title area with heading and optional subtitle.
 * Uses the Nimbus Heading component internally for consistent typography
 * matching the AppKit page title styling.
 *
 * @supportsStyleProps
 */
export const MainPageTitle = ({
  ref,
  title,
  subtitle,
  ...props
}: MainPageTitleProps) => (
  <div ref={ref as React.Ref<HTMLDivElement>}>
    <Heading as="h1" {...props}>
      {title}
    </Heading>
    {subtitle && (
      <Text color="neutral.11" textStyle="sm">
        {subtitle}
      </Text>
    )}
  </div>
);

MainPageTitle.displayName = "MainPage.Title";
