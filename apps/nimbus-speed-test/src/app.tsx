import {
  Box,
  Flex,
  Heading,
  Text,
  useColorMode,
  Button,
} from "@commercetools/nimbus";

import { CommercetoolsCube } from "@commercetools/nimbus-icons";

export const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex width="100vw" height="100vh">
      <Flex direction="column" m="auto">
        <Box
          mx="auto"
          mb="400"
          animation="bounce"
          animationDuration="1.5s"
          boxSize="5600"
          asChild
        >
          <CommercetoolsCube />
        </Box>
        <Heading>@commercetools/nimbus</Heading>
        <Text mx="auto" color="colorPalette.11" mb="600">
          Nimbus + Vite + TS
        </Text>
        <Button
          variant="solid"
          tone="primary"
          mx="auto"
          onClick={toggleColorMode}
        >
          Switch to {colorMode === "light" ? "dark" : "light"} theme
        </Button>
      </Flex>
    </Flex>
  );
};
