import { Flex, Box, Text } from "@bleh-ui/react";

import { ModeToggleButton } from "../ModeToggleButton";

import { AppNavBarSearch } from "./AppNavBarSearch";

export const AppNavBar = () => {
  return (
    <Flex
      p="4"
      borderBottom="1px solid"
      borderColor="neutral.3"
      alignItems="center"
    >
      <Text textStyle="2xl" asChild fontWeight="bold">
        <a href="/">@bleh-ui</a>
      </Text>
      <Box flexGrow="1" />
      <Flex flexGrow="1">
        <AppNavBarSearch />
      </Flex>
      <Box flexGrow="1" />
      <Box>
        <ModeToggleButton />
      </Box>
    </Flex>
  );
};
