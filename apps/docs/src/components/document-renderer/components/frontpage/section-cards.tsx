import { SimpleGrid } from "@commercetools/nimbus";
import { useManifest } from "@/contexts/manifest-context";
import { DocumentCard } from "@/components/document-card";
import { countPagesBelow } from "@/utils/count-pages-below";
import { findSectionRoutes } from "./section-routes";

/**
 * One illustrated card per main section of the docs. The cards are the same
 * `DocumentCard`s the category overviews use, so title, description and
 * illustrations come from the section pages themselves.
 */
export const SectionCards = () => {
  const { routeManifest } = useManifest();
  if (!routeManifest) return null;

  return (
    <SimpleGrid
      as="section"
      aria-label="Sections"
      columns={{ base: 1, sm: 2, lg: 3 }}
      gap="400"
    >
      {findSectionRoutes(routeManifest.routes).map((doc) => (
        <DocumentCard
          key={doc.path}
          doc={doc}
          pageCount={countPagesBelow(routeManifest.routes, doc)}
        />
      ))}
    </SimpleGrid>
  );
};
