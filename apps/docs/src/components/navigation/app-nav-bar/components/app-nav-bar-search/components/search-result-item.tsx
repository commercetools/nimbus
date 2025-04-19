import * as icons from "@commercetools/nimbus-icons";
import { Box, Flex, Heading, Text } from "@commercetools/nimbus";
import { SearchResultItemProps } from "../app-nav-bar-search";

export const SearchResultItem = ({ item, ...props }: SearchResultItemProps) => {
  const IconComponent =
    (icons[item.icon as keyof typeof icons] as React.ElementType) ||
    icons.Description;
  return (
    <Flex py="300" cursor="pointer" minWidth="0" maxWidth="100%">
      <Box pr="400" pt="100">
        <IconComponent size="1.5em" />
      </Box>
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
