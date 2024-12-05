import { Flex, Box, Stack } from "@bleh-ui/react";

import { ModeToggleButton } from "../ModeToggleButton";

import { AppNavBarSearch } from "./AppNavBarSearch";
import { AppNavBarCreateButton } from "./AppNavBarCreateButton";
import { DevOnly } from "../DevOnly";
import { AppNavBarBrand } from "./AppNavBarBrand";

export const AppNavBar = () => {
  return (
    <Flex
      p="4"
      borderBottom="1px solid"
      borderColor="neutral.3"
      alignItems="center"
    >
      <Stack direction="row" gap="8" alignItems="center">
        <AppNavBarBrand />
        <DevOnly>
          <AppNavBarCreateButton />
        </DevOnly>
      </Stack>

      <Box></Box>
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
