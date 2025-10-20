import { useAtomValue } from "jotai";
import { Suspense, FC } from "react";
import { documentationAtom } from "@/atoms/documentation";
import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import { useActiveDoc } from "@/hooks/useActiveDoc";

/**
 * Component that displays an overview of all documents in the current menu category.
 * To be used in MDX files to show titles and descriptions of documents in the active category.
 *
 * This component uses the useActiveDoc hook which provides direct lookup to avoid
 * race conditions with derived async atoms during navigation.
 */
const CategoryOverviewContent: FC<{ variant?: string }> = ({ variant }) => {
  const documentation = useAtomValue(documentationAtom);
  const activeDoc = useActiveDoc();

  // If no document found for this route, don't render
  if (!activeDoc) {
    console.log("[CategoryOverview] No activeDoc found");
    return null;
  }

  console.log("[CategoryOverview] Rendering with:", {
    route: activeDoc.meta.route,
    menu: activeDoc.meta.menu,
    menuLength: activeDoc.meta.menu.length,
  });

  // Get the current category (first item in the menu array)
  const currentCategory = activeDoc.meta.menu[0];

  // If there's a second level in the menu, use that for a more specific category
  const subcategory =
    activeDoc.meta.menu.length > 1 ? activeDoc.meta.menu[1] : null;

  console.log("[CategoryOverview] Filter params:", {
    currentCategory,
    subcategory,
    totalDocs: Object.values(documentation).length,
  });

  // Find all documents that are in the same category
  const categoryDocs = Object.values(documentation).filter((doc) => {
    // Make sure we're in the same top-level category
    if (doc.meta.menu[0] !== currentCategory) {
      return false;
    }
    // Don't include currently active document
    if (doc.meta.route === activeDoc.meta.route) {
      return false;
    }

    // If we're in a subcategory page, only show documents with the same first and second level
    if (subcategory && activeDoc.meta.menu.length > 1) {
      return doc.meta.menu.length > 1 && doc.meta.menu[1] === subcategory;
    }

    // If we're at the category root, only show direct subcategories
    return (
      doc.meta.menu.length === 2 && doc.meta.route !== activeDoc.meta.route
    );
  });

  console.log("[CategoryOverview] Filtered docs:", {
    count: categoryDocs.length,
    routes: categoryDocs.map((d) => d.meta.route),
  });

  // Sort the documents by their order property
  const sortedDocs = [...categoryDocs].sort((a, b) => {
    return (a.meta.order || 999) - (b.meta.order || 999);
  });

  if (sortedDocs.length === 0) {
    console.log(
      "[CategoryOverview] WARNING: No documents found after filtering!"
    );
    return (
      <Box my="600">
        <Text>No documents found in this category.</Text>
      </Box>
    );
  }

  const IconComponent = ({ id }) => {
    const Ic = Icons[id];
    return <Ic />;
  };

  if (variant === "list") {
    return (
      <Box my="600">
        <Stack as="ul" gap="0" direction="row" wrap="wrap">
          {sortedDocs.map((doc) => (
            <Box as="li" width="full" pr="200" pb="200">
              <Link unstyled href={doc.meta.route}>
                <Card.Root
                  key={doc.meta.route}
                  cardPadding="md"
                  borderStyle="outlined"
                  width="full"
                >
                  <Card.Content>
                    <Flex>
                      <Box color="primary.11" textStyle="2xl" mr="300">
                        <IconComponent id={doc.meta.icon || "ArrowForward"} />
                      </Box>
                      <Box>
                        <Heading
                          color="neutral.12"
                          textDecoration="none"
                          size="lg"
                          truncate
                        >
                          {doc.meta.title}
                        </Heading>
                        <Text color="neutral.11" lineClamp={1}>
                          {doc.meta.description}
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
      <Stack gap="0" direction="row" wrap="wrap">
        {sortedDocs.map((doc) => (
          <Box width="1/4" pr="200" pb="200" key={doc.meta.route}>
            <Link unstyled href={doc.meta.route}>
              <Card.Root
                key={doc.meta.route}
                cardPadding="md"
                borderStyle="outlined"
                width="full"
              >
                <Card.Content height="200px">
                  <Stack>
                    <Box color="primary.11" textStyle="5xl" mb="200">
                      <IconComponent id={doc.meta.icon || "Layers"} />
                    </Box>
                    <Heading
                      color="neutral.12"
                      textDecoration="none"
                      size="lg"
                      truncate
                    >
                      {doc.meta.title}
                    </Heading>

                    <Text color="neutral.11" lineClamp={4}>
                      {doc.meta.description}
                    </Text>
                  </Stack>
                </Card.Content>
              </Card.Root>
            </Link>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

/**
 * Public export with Suspense boundary to handle async atom loading.
 * This ensures the component properly handles the async nature of the documentation
 * and active document atoms, providing a loading state while data is being fetched.
 */
export const CategoryOverview: FC<{ variant?: string }> = (props) => {
  return (
    <Suspense fallback={<Box>Loading categories...</Box>}>
      <CategoryOverviewContent {...props} />
    </Suspense>
  );
};
