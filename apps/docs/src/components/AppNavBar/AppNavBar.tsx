import { Flex, Box, Text, Stack } from "@bleh-ui/react";

import { ModeToggleButton } from "../ModeToggleButton";

import { AppNavBarSearch } from "./AppNavBarSearch";
import { AppNavBarCreateButton } from "./AppNavBarCreateButton";
import { DevOnly } from "../DevOnly";

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
        <Stack direction="row" gap="4" alignItems="center">
          <DevOnly>
            <AppNavBarCreateButton />
          </DevOnly>
          <ModeToggleButton />
        </Stack>
      </Box>
    </Flex>
  );
};
