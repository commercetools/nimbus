import { FC } from "react";
import { Box, Flex, Heading, Link, Stack, Text } from "@commercetools/nimbus";
import { useManifest } from "@/contexts/manifest-context";
import { useActiveDoc } from "@/hooks/useActiveDoc";
import { Carousel } from "@/components/carousel";
import { Illustration, hasIllustration } from "@/components/illustration";
import { getRelatedRoutes } from "./get-related-routes";

/** One title line and two description lines, each as high as line height `600`. */
const TEXT_HEIGHT = "calc({lineHeights.600} * 3)";

/**
 * "Related components" carousel for the top of a page, below the header. Each
 * card has an illustration, a one-line title and a description of up to two
 * lines. It shows the documents listed in the `related` list of the route
 * manifest, in that order, so a reader sees similar components before choosing
 * one. Renders nothing when the active document has no related documents.
 */
export const RelatedDocuments: FC = () => {
  const { routeManifest } = useManifest();
  const { doc: activeDoc } = useActiveDoc();

  if (!routeManifest || !activeDoc) return null;

  const related = getRelatedRoutes(routeManifest.routes, activeDoc.meta.id);

  if (related.length === 0) return null;

  return (
    <Carousel label="Related components">
      {related.map((doc) => {
        const illustration = doc.illustrations?.find(hasIllustration);
        return (
          <Link
            key={doc.id}
            href={doc.path}
            textDecoration="none"
            display="block"
            width="320px"
          >
            <Flex
              alignItems="center"
              gap="300"
              p="200"
              border="1px solid"
              borderColor="neutral.6"
              borderRadius="300"
              bg="bg"
              _hover={{ borderColor: "primary.7", bg: "primary.2" }}
            >
              {/* As tall as the text: one title line plus two description
                  lines, each with the `600` line height (24px), so 72px. */}
              <Box
                flexShrink="0"
                boxSize={TEXT_HEIGHT}
                borderRadius="200"
                bg="primary.2"
                overflow="hidden"
                aria-hidden="true"
              >
                {illustration && <Illustration name={illustration} />}
              </Box>
              <Stack
                gap="0"
                minWidth="0"
                minHeight={TEXT_HEIGHT}
                justify="center"
              >
                <Heading
                  as="h3"
                  size="lg"
                  color="neutral.12"
                  lineHeight="600"
                  truncate
                >
                  {doc.title}
                </Heading>
                {doc.description && (
                  <Text
                    color="neutral.11"
                    textStyle="md"
                    lineHeight="600"
                    lineClamp={2}
                  >
                    {doc.description}
                  </Text>
                )}
              </Stack>
            </Flex>
          </Link>
        );
      })}
    </Carousel>
  );
};
