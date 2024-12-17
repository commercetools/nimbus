import { forwardRef } from "react";
import { SearchResultItemProps } from "../app-nav-bar-search.types";
import { icons } from "@bleh-ui/icons";
import { Box, Flex, Heading, Text } from "@bleh-ui/react";

export const SearchResultItem = forwardRef(
  ({ item, ...props }: SearchResultItemProps, ref) => {
    const isSelected = !!props["data-active-item"];

    const IconComponent =
      (icons[item.icon as keyof typeof icons] as React.ElementType) ||
      icons.FileText;

    const styles = isSelected
      ? { bg: "primary.9", color: "primary.contrast" }
      : {};

    return (
      <Flex px="6" py="3">
        <Box pr="4" pt="1">
          <IconComponent size="1.5em" />
        </Box>
        <Box
          display="flex"
          flexDir="column"
          gap="0"
          ref={ref}
          {...styles}
          {...props}
        >
          <Heading size="lg" truncate>
            {item.title}{" "}
          </Heading>
          <Text mb="1" truncate>
            {item.description}
          </Text>
          <Text my="1" textStyle="xs" truncate opacity={3 / 4}>
            {item.menu.join(" -> ")}
          </Text>
        </Box>
      </Flex>
    );
  }
);
