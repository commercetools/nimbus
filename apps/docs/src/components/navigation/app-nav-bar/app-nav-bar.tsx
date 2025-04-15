import { Flex, Box, Stack } from "@commercetools/nimbus";
import { DevOnly } from "@/components/utils/dev-only";

import { ModeToggleButton } from "./components/mode-toggle-button/index.ts";
import { AppNavBarSearch } from "./components/app-nav-bar-search/app-nav-bar-search.tsx";
import { AppNavBarCreateButton } from "./components/app-nav-bar-create-button.tsx";
import { AppNavBarBrand } from "./components/app-nav-bar-brand.tsx";

export const AppNavBar = () => {
  return (
    <Flex
      p="400"
      borderBottom="solid-25"
      borderColor="neutral.3"
      alignItems="center"
    >
      <Stack direction="row" gap="800" alignItems="center">
        <AppNavBarBrand />
        <DevOnly>
          <AppNavBarCreateButton />
        </DevOnly>
      </Stack>
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
