import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Stack, Text } from "@commercetools/nimbus";

/**
 * Hero band for the docs home page.
 *
 * A full-width, brand-tinted banner: the Nimbus wordmark, a one-line value
 * proposition, and two calls to action. The background is a token-based
 * gradient (`{colors.primary.*}`) so it follows both the light/dark theme and
 * the active color palette — no hardcoded colors.
 *
 * The CTAs use real Nimbus `Button`s and navigate via react-router (`onPress`),
 * so the home page dogfoods the component while staying client-side routed.
 * "Get started" points at Installation, which documents the full peer-dependency
 * install (a bare `pnpm add @commercetools/nimbus` would be misleading).
 */
export const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box
      as="section"
      borderRadius="300"
      border="solid-25"
      borderColor="primary.4"
      bgImage="linear-gradient(135deg, {colors.primary.3}, {colors.primary.2} 55%, {colors.bg})"
    >
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        gap="600"
        px="600"
        py="1200"
      >
        <Stack gap="300" alignItems="center">
          <Heading size="7xl" letterSpacing="-.025em" color="neutral.12">
            Nimbus
          </Heading>
          <Text fontSize="lg" color="neutral.11" maxWidth="52ch">
            React components, hooks &amp; icons for building accessible, pretty
            &amp; robust interfaces.
          </Text>
        </Stack>

        <Stack direction="row" gap="400" alignItems="center">
          <Button
            colorPalette="primary"
            size="md"
            variant="solid"
            onPress={() => navigate("/home/getting-started/installation")}
          >
            Get started
          </Button>
          <Button
            colorPalette="primary"
            size="md"
            variant="outline"
            onPress={() => navigate("/components")}
          >
            Browse components
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};
