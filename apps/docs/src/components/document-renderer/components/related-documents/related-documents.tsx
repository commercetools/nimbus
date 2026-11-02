import { FC } from "react";
import { Box, Flex, Link, Text } from "@commercetools/nimbus";
import { useManifest } from "@/contexts/manifest-context";
import { useActiveDoc } from "@/hooks/useActiveDoc";
import { Carousel } from "@/components/carousel";
import { Illustration, hasIllustration } from "@/components/illustration";
import { getRelatedRoutes } from "./get-related-routes";

/**
 * "Related components" carousel for the top of a page, below the header. It
 * shows the documents listed in the `related` list of the route manifest, in
 * that order, so a reader sees similar components before choosing one. Renders
 * nothing when the active document has no related documents.
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
            width="220px"
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
              <Box
                flexShrink="0"
                width="48px"
                height="48px"
                borderRadius="200"
                bg="primary.2"
                overflow="hidden"
                aria-hidden="true"
              >
                {illustration && <Illustration name={illustration} />}
              </Box>
              <Text color="neutral.12" fontWeight="500" truncate>
                {doc.title}
              </Text>
            </Flex>
          </Link>
        );
      })}
    </Carousel>
  );
};
