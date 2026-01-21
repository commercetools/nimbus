import { Suspense, FC } from "react";
import { useManifest } from "@/contexts/manifest-context";
import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import { useActiveDoc } from "@/hooks/useActiveDoc";

/**
 * Component that displays an overview of all documents in the current menu category.
 * To be used in MDX files to show titles and descriptions of documents in the active category.
 *
 * This component uses the route manifest to list documents in the same category.
 */
const CategoryOverviewContent: FC<{ variant?: string }> = ({ variant }) => {
  const { routeManifest } = useManifest();
  const { doc: activeDoc } = useActiveDoc();

  // If no document found for this route, don't render
  if (!activeDoc || !routeManifest) {
    return null;
  }

  // Get the current category (first item in the menu array)
  const currentCategory = activeDoc.meta.menu[0];

  // If there's a second level in the menu, use that for a more specific category
  const subcategory =
    activeDoc.meta.menu.length > 1 ? activeDoc.meta.menu[1] : null;

  // Find all documents that are in the same category from the manifest
  const categoryDocs = routeManifest.routes.filter((route) => {
    // Make sure we're in the same top-level category
    if (route.menu[0] !== currentCategory) {
      return false;
    }
    // Don't include currently active document
    if (route.path === `/${activeDoc.meta.route}`) {
      return false;
    }

    // If we're in a subcategory page, only show documents with the same first and second level
    if (subcategory && activeDoc.meta.menu.length > 1) {
      return route.menu.length > 1 && route.menu[1] === subcategory;
    }

    // If we're at the category root, only show direct subcategories
    return route.menu.length === 2 && route.path !== `/${activeDoc.meta.route}`;
  });

  // Sort the documents by their order property
  const sortedDocs = [...categoryDocs].sort((a, b) => {
    return (a.order || 999) - (b.order || 999);
  });

  if (sortedDocs.length === 0) {
    return (
      <Box my="600">
        <Text>No documents found in this category.</Text>
      </Box>
    );
  }

  const IconComponent = ({
    id,
    fallback,
  }: {
    id?: string;
    fallback: string;
  }) => {
    const iconName = id || fallback;
    const Ic = Icons[iconName as keyof typeof Icons];
    if (!Ic) {
      // If icon doesn't exist, use fallback
      const FallbackIcon = Icons[fallback as keyof typeof Icons];
      return FallbackIcon ? <FallbackIcon /> : null;
    }
    return <Ic />;
  };

  if (variant === "list") {
    return (
      <Box>
        <Stack as="ul" gap="0" direction="row" wrap="wrap">
          {sortedDocs.map((doc) => (
            <Box as="li" width="full" pr="200" pb="200" key={doc.path}>
              <Link textDecoration="none" href={doc.path} width="full">
                <Card.Root
                  cardPadding="md"
                  borderStyle="none"
                  ml="-400"
                  width="full"
                  _hover={{ bg: "colorPalette.2" }}
                >
                  <Card.Content>
                    <Flex>
                      <Box color="primary.11" textStyle="2xl" mr="400">
                        <IconComponent id={doc.icon} fallback="ArrowForward" />
                      </Box>
                      <Box>
                        <Heading
                          color="neutral.12"
                          textDecoration="none"
                          size="lg"
                          truncate
                        >
                          {doc.title}
                        </Heading>
                        <Text color="neutral.11" lineClamp={1}>
                          {doc.description}
                        </Text>
                      </Box>
                    </Flex>
                  </Card.Content>
                </Card.Root>
              </Link>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box my="600">
      <SimpleGrid columns={3} gap="200">
        {sortedDocs.map((doc) => (
          <Link key={doc.path} textDecoration="none" href={doc.path}>
            <Card.Root cardPadding="md" borderStyle="none" width="full">
              <Card.Content>
                <Stack>
                  <Box color="primary.11" textStyle="5xl" mb="200">
                    <IconComponent id={doc.icon} fallback="Layers" />
                  </Box>
                  <Heading
                    color="neutral.12"
                    textDecoration="none"
                    size="lg"
                    truncate
                  >
                    {doc.title}
                  </Heading>

                  <Text color="neutral.11" lineClamp={4}>
                    {doc.description}
                  </Text>
                </Stack>
              </Card.Content>
            </Card.Root>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

/**
 * Public export with Suspense boundary to handle async data loading.
 * This ensures the component properly handles the async nature of the data
 * and provides a loading state while data is being fetched.
 */
export const CategoryOverview: FC<{ variant?: string }> = (props) => {
  return (
    <Suspense fallback={<Box>Loading categories...</Box>}>
      <CategoryOverviewContent {...props} />
    </Suspense>
  );
};
