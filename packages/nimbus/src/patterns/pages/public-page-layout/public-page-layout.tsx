import { Flex } from "@/components/flex/flex";
import { Heading } from "@/components/heading/heading";
import { Stack } from "@/components/stack/stack";
import { Box } from "@/components/box/box";
import { useLocalizedStringFormatter } from "@/hooks";
import { publicPageLayoutMessagesStrings } from "./public-page-layout.messages";
import type { PublicPageLayoutProps } from "./public-page-layout.types";

const contentMaxWidth = {
  normal: "sm",
  wide: "3xl",
} as const;

/**
 * # PublicPageLayout
 *
 * A pre-built, centered layout for public-facing pages (login, registration,
 * password reset). Provides slots for a brand logo, welcome heading, main
 * content, and legal footer.
 *
 * Replaces MC's `public-page-layout`. For layouts needing a different
 * structure, compose Flex and Stack directly (escape hatch).
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <PublicPageLayout
 *   logo={<img src={logo} alt="Brand logo" />}
 *   welcomeMessage="Welcome to the Merchant Center"
 *   legalMessage={<Text>© 2026 commercetools</Text>}
 * >
 *   <LoginForm />
 * </PublicPageLayout>
 * ```
 */
export const PublicPageLayout = ({
  children,
  logo,
  welcomeMessage,
  legalMessage,
  contentWidth = "normal",
  "aria-label": ariaLabel,
  ...styleProps
}: PublicPageLayoutProps) => {
  const msg = useLocalizedStringFormatter(publicPageLayoutMessagesStrings);
  const resolvedAriaLabel = ariaLabel ?? msg.format("ariaLabel");
  const maxW = contentMaxWidth[contentWidth];

  return (
    <Flex
      as="main"
      aria-label={resolvedAriaLabel}
      width="100%"
      minHeight="100vh"
      paddingY="600"
      justify="center"
      {...styleProps}
    >
      <Stack gap="600" alignItems="center" width="100%">
        {logo != null && (
          <Flex data-slot="logo" justify="center">
            {logo}
          </Flex>
        )}
        {welcomeMessage != null && (
          <Heading data-slot="welcome-message" as="h2" textAlign="center">
            {welcomeMessage}
          </Heading>
        )}
        <Stack gap="600" alignItems="center" width="100%">
          <Box data-slot="content" maxW={maxW} width="100%">
            {children}
          </Box>
          {legalMessage != null && (
            <Box data-slot="legal-message" maxW={maxW} textAlign="center">
              {legalMessage}
            </Box>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};

PublicPageLayout.displayName = "PublicPageLayout";
