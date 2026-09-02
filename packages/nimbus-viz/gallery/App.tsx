import {
  NimbusProvider,
  useColorMode,
  Box,
  Flex,
  Heading,
  Text,
  Button,
} from "@commercetools/nimbus";
import { ChartThemeProvider, ColorScaleProvider, type ColorMode } from "../src";
import { Explorer } from "./Explorer";

// A dashboard-wide entity→color domain so a series keeps its color across
// charts (e.g. "Returning" is the same hue wherever it appears).
const COLOR_DOMAIN = [
  // line series are keyed by id, not label
  "rev",
  "cost",
  "profit",
  "New",
  "Returning",
  "Wholesale",
  "EU",
  "US",
  "Web",
  "Mobile",
  "Marketplace",
  "POS",
  "Partner",
];

export function App() {
  return (
    <NimbusProvider defaultTheme="light">
      <GalleryShell />
    </NimbusProvider>
  );
}

function GalleryShell() {
  const { colorMode, toggleColorMode } = useColorMode();
  const mode: ColorMode = colorMode === "dark" ? "dark" : "light";

  return (
    <ChartThemeProvider mode={mode}>
      <Box minH="100vh" bg="neutral.1" color="neutral.12" p="600">
        <Flex as="header" align="center" justify="space-between" mb="600">
          <Box>
            <Heading>nimbus-viz gallery</Heading>
            <Text color="fg.muted" mt="100">
              Prototype charts · visx + Nimbus tokens
            </Text>
          </Box>
          <Button
            size="sm"
            variant="outline"
            colorPalette="neutral"
            onPress={toggleColorMode}
          >
            {mode === "light" ? "🌙 Dark" : "☀️ Light"}
          </Button>
        </Flex>
        <ColorScaleProvider domain={COLOR_DOMAIN}>
          <Explorer />
        </ColorScaleProvider>
      </Box>
    </ChartThemeProvider>
  );
}
