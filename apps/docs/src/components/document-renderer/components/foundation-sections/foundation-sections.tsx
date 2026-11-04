import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Flex, Heading, Stack, Text } from "@commercetools/nimbus";
import { useManifest } from "@/contexts/manifest-context";
import {
  IllustrationCollage,
  hasIllustration,
} from "@/components/illustration";
import { countPagesBelow } from "@/utils/count-pages-below";
import { findSectionRoutes } from "../frontpage/section-routes";

export type FoundationSection = {
  /** Route path of the page the section links to. */
  path: string;
  /** Names of the illustrations to show; the first one is in front. */
  illustrations?: string[];
  /** Label of the button. */
  cta: string;
  /** Color of the illustration band. */
  colorPalette?: "primary" | "info" | "positive" | "warning";
};

type FoundationSectionsProps = {
  sections: FoundationSection[];
};

/**
 * One large band per section: an illustration next to the title, the
 * description and a button. The bands alternate sides on wide screens and
 * stack on narrow ones. Title, description and page count come from the page
 * each section links to.
 */
export const FoundationSections: FC<FoundationSectionsProps> = ({
  sections,
}) => {
  const { routeManifest } = useManifest();
  if (!routeManifest) return null;

  return (
    <Stack gap={{ base: "1000", md: "1200" }} my="800">
      {sections.map((section, index) => {
        const [doc] = findSectionRoutes(routeManifest.routes, [section.path]);
        if (!doc) return null;

        const names = (section.illustrations ?? doc.illustrations ?? []).filter(
          hasIllustration
        );
        const pageCount = countPagesBelow(routeManifest.routes, doc);

        return (
          <Flex
            as="section"
            key={doc.path}
            aria-labelledby={`foundation-${index}`}
            direction={{
              base: "column",
              md: index % 2 === 0 ? "row" : "row-reverse",
            }}
            align="center"
            gap={{ base: "400", md: "800" }}
          >
            {names.length > 0 && (
              <Box
                colorPalette={section.colorPalette ?? "primary"}
                width={{ base: "full", md: "50%" }}
                flexShrink={0}
                aspectRatio="16 / 10"
                overflow="hidden"
                borderRadius="400"
                bg="colorPalette.2"
                // tiles size themselves from the band height and draw no
                // background of their own
                css={{
                  containerType: "size",
                  "--illustration-gradient-start": "transparent",
                }}
              >
                <IllustrationCollage names={names} open />
              </Box>
            )}
            <Stack gap="300" alignItems="flex-start" flex="1">
              <Heading as="h2" id={`foundation-${index}`} size="3xl">
                {doc.title}
              </Heading>
              <Text textStyle="lg" color="neutral.11" maxWidth="44ch">
                {doc.description}
              </Text>
              {pageCount > 0 && (
                <Text textStyle="sm" color="neutral.11">
                  {pageCount} {pageCount === 1 ? "page" : "pages"}
                </Text>
              )}
              <Button
                variant="solid"
                colorPalette="primary"
                size="md"
                mt="200"
                asChild
              >
                <RouterLink to={doc.path}>{section.cta}</RouterLink>
              </Button>
            </Stack>
          </Flex>
        );
      })}
    </Stack>
  );
};
