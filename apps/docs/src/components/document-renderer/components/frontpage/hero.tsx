import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, Heading, Stack, Text } from "@commercetools/nimbus";
import {
  IllustrationCollage,
  hasIllustration,
} from "@/components/illustration";

/** Illustrations in the hero, left to right. The middle one is in front. */
const HERO_ILLUSTRATIONS = ["button", "date-picker", "data-table"];

/**
 * Hero of the docs start page: the name, one sentence about Nimbus and a link
 * to the installation guide, with a spread row of component illustrations on
 * the right. The illustrations are hidden below the `md` breakpoint.
 */
export const Hero = () => {
  const illustrations = HERO_ILLUSTRATIONS.filter(hasIllustration);

  return (
    <Grid
      as="section"
      aria-labelledby="hero-title"
      colorPalette="primary"
      bg="colorPalette.2"
      borderRadius="300"
      overflow="hidden"
      templateColumns={{
        base: "minmax(0, 1fr)",
        md: illustrations.length > 0 ? "repeat(2, minmax(0, 1fr))" : undefined,
      }}
      alignItems="center"
      gap="800"
      px={{ base: "600", md: "1000" }}
      py={{ base: "1000", md: "1200" }}
    >
      <Stack gap="600" alignItems="flex-start">
        <Stack gap="300">
          <Heading
            as="h1"
            id="hero-title"
            size="6xl"
            letterSpacing="-0.025em"
            color="neutral.12"
          >
            Nimbus
          </Heading>
          <Text textStyle="lg" color="neutral.11" maxWidth="44ch">
            React components, hooks &amp; icons for building accessible, pretty
            &amp; robust interfaces.
          </Text>
        </Stack>
        <Button variant="solid" colorPalette="primary" size="md" asChild>
          <RouterLink to="/home/getting-started/installation">
            Get started
          </RouterLink>
        </Button>
      </Stack>

      {illustrations.length > 0 && (
        <Box
          display={{ base: "none", md: "block" }}
          width="full"
          aspectRatio="16 / 10"
          // tiles size themselves from the height and draw their own background
          css={{
            containerType: "size",
            "--illustration-gradient-start": "transparent",
          }}
        >
          <IllustrationCollage names={illustrations} open />
        </Box>
      )}
    </Grid>
  );
};
