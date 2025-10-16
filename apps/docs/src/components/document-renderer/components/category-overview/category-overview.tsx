import { useAtomValue } from "jotai";
import { categoryDocsAtom } from "@/atoms/category-docs";
import {
  Box,
  Card,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { FC, memo, useMemo } from "react";
import * as Icons from "@commercetools/nimbus-icons";

/**
 * Memoized icon component to prevent unnecessary re-renders.
 */
const IconComponent = memo<{ id: string }>(({ id }) => {
  const IconElement = Icons[id];
  return IconElement ? <IconElement /> : null;
});

IconComponent.displayName = "IconComponent";

/**
 * Component that displays an overview of all documents in the current menu category.
 * To be used in MDX files to show titles and descriptions of documents in the active category.
 */
export const CategoryOverview: FC = ({ variant }) => {
  // Use the derived atom that handles all filtering and sorting logic
  const sortedDocs = useAtomValue(categoryDocsAtom);

  // Memoize the empty state to prevent unnecessary re-renders
  const emptyState = useMemo(
    () => (
      <Box my="600">
        <Text>No documents found in this category.</Text>
      </Box>
    ),
    []
  );

  if (sortedDocs.length === 0) {
    return emptyState;
  }

  // Memoize list variant rendering
  const listView = useMemo(
    () => (
      <Box my="600">
        <Stack as="ul" gap="0" direction="row" wrap="wrap">
          {sortedDocs.map((doc) => (
            <Box as="li" width="full" pr="200" pb="200" key={doc.meta.route}>
              <Link unstyled href={doc.meta.route}>
                <Card.Root cardPadding="md" borderStyle="outlined" width="full">
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
    ),
    [sortedDocs]
  );

  // Memoize grid variant rendering
  const gridView = useMemo(
    () => (
      <Box my="600">
        <Stack gap="0" direction="row" wrap="wrap">
          {sortedDocs.map((doc) => (
            <Box width="1/4" pr="200" pb="200" key={doc.meta.route}>
              <Link unstyled href={doc.meta.route}>
                <Card.Root cardPadding="md" borderStyle="outlined" width="full">
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
    ),
    [sortedDocs]
  );

  return variant === "list" ? listView : gridView;
};
