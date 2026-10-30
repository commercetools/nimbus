import { useMemo } from "react";
import * as icons from "@commercetools/nimbus-icons";
import { Box, Flex, Heading, Text } from "@commercetools/nimbus";
import { SearchResultItemProps } from "../app-nav-bar-search";
import { useManifest } from "@/contexts/manifest-context";
import {
  ComponentIllustration,
  hasIllustration,
} from "@/components/component-illustration";

/**
 * Height of the three text lines (title, description, breadcrumb, measured), so
 * the tile at the start of a row is as tall as the text. Keep in sync with
 * `RESULT_ROW_HEIGHT` in app-nav-bar-search.tsx (this plus the row padding).
 */
const TILE_SIZE = "76px";

export const SearchResultItem = ({ item, ...props }: SearchResultItemProps) => {
  const { routeManifest } = useManifest();

  // The first illustration of the page, the same one its overview card shows.
  const illustration = useMemo(() => {
    const route = routeManifest?.routes.find(
      (candidate) => candidate.path === `/${item.route}`
    );
    return route?.illustrations.find(hasIllustration);
  }, [routeManifest, item.route]);

  const IconComponent =
    (icons[item.icon as keyof typeof icons] as React.ElementType) ||
    icons.Description;
  return (
    <Flex py="300" cursor="pointer" minWidth="0" maxWidth="100%">
      <Flex
        colorPalette="primary"
        boxSize={TILE_SIZE}
        flexShrink={0}
        mr="400"
        align="center"
        justify="center"
        borderRadius="200"
        overflow="hidden"
        bg="colorPalette.3"
        color="colorPalette.11"
        textStyle="4xl"
        css={{ "--illustration-gradient-start": "transparent" }}
      >
        {illustration ? (
          <ComponentIllustration name={illustration} />
        ) : (
          <IconComponent />
        )}
      </Flex>
      <Box minWidth="0" display="flex" flexDir="column" gap="0" {...props}>
        <Heading size="lg" truncate>
          {item.title}{" "}
        </Heading>
        <Text mb="100" truncate>
          {item.description}
        </Text>
        <Text my="100" textStyle="xs" truncate opacity={3 / 4}>
          {item.menu.join(" -> ")}
        </Text>
      </Box>
    </Flex>
  );
};
