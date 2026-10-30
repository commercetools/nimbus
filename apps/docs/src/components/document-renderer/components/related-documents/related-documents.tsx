import { FC } from "react";
import { Box, Heading, SimpleGrid } from "@commercetools/nimbus";
import { useManifest } from "@/contexts/manifest-context";
import { useActiveDoc } from "@/hooks/useActiveDoc";
import { DocumentCard } from "@/components/document-card";
import { getRelatedRoutes } from "./get-related-routes";

/**
 * "Related components" section for the end of the Overview tab. It shows the
 * documents listed in the `related` list of the route manifest, in that order.
 * Renders nothing when the active document has no related documents.
 */
export const RelatedDocuments: FC = () => {
  const { routeManifest } = useManifest();
  const { doc: activeDoc } = useActiveDoc();

  if (!routeManifest || !activeDoc) return null;

  const related = getRelatedRoutes(routeManifest.routes, activeDoc.meta.id);

  if (related.length === 0) return null;

  return (
    <Box as="section" aria-labelledby="related-components-heading" mt="800">
      <Heading as="h2" id="related-components-heading" size="xl" mb="400">
        Related components
      </Heading>
      <SimpleGrid
        // auto-fill keeps a lone card at column width instead of stretching it
        gridTemplateColumns="repeat(auto-fill, minmax(260px, 1fr))"
        gap="400"
      >
        {related.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
