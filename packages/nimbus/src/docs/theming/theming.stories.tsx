import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Button, Stack, Text } from "@commercetools/nimbus";
import { createNimbusTheme, generateColorScale } from "@/theme-generator";
import { themeConfig } from "@/theme";

const meta: Meta = {
  title: "Docs/Theming",
  tags: ["!autodocs"],
  parameters: {
    a11y: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

function PaletteSwatches({
  name,
  palette,
}: {
  name: string;
  palette: ReturnType<typeof generateColorScale>["light"];
}) {
  const steps = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ] as const;
  return (
    <Box>
      <Text fontWeight="bold" mb="2">
        {name}
      </Text>
      <Stack direction="row" gap="1">
        {steps.map((step) => (
          <Box
            key={step}
            w="40px"
            h="40px"
            bg={`${name}.${step}`}
            borderRadius="md"
            title={`${name}.${step}: ${palette[step]}`}
          />
        ))}
      </Stack>
    </Box>
  );
}

const redTheme = createNimbusTheme({
  baseConfigs: [themeConfig],
  palettes: {
    brand: { type: "generated", baseColor: "#E63946" },
  },
  semantic: { primary: "brand" },
});

const redPalette = generateColorScale("#E63946");

export const CustomBrandPalette: Story = {
  name: "Custom Brand Palette",
  parameters: { nimbusTheme: redTheme },
  render: () => (
    <Stack gap="200">
      <Text fontSize="xl" fontWeight="bold">
        Custom Brand Theme (base: #E63946)
      </Text>
      <PaletteSwatches name="brand" palette={redPalette.light} />
      <Text fontSize="lg" fontWeight="bold">
        Semantic "primary" remapped to brand
      </Text>
      <Stack direction="row" gap="300">
        <Button colorPalette="primary" variant="solid">
          Primary Solid
        </Button>
        <Button colorPalette="primary" variant="subtle">
          Primary Subtle
        </Button>
        <Button colorPalette="primary" variant="outline">
          Primary Outline
        </Button>
        <Button colorPalette="primary" variant="ghost">
          Primary Ghost
        </Button>
      </Stack>
      <Text fontSize="md" color="fg">
        These buttons use colorPalette="primary", which is remapped to the
        custom "brand" palette (#E63946) via the semantic config.
      </Text>
    </Stack>
  ),
};

const tealTheme = createNimbusTheme({
  baseConfigs: [themeConfig],
  palettes: {
    ocean: { type: "generated", baseColor: "#2A9D8F" },
    sunset: { type: "generated", baseColor: "#E9C46A" },
  },
  semantic: { primary: "ocean", warning: "sunset" },
});

const oceanPalette = generateColorScale("#2A9D8F");
const sunsetPalette = generateColorScale("#E9C46A");

export const MultiplePalettes: Story = {
  name: "Multiple Custom Palettes",
  parameters: { nimbusTheme: tealTheme },
  render: () => (
    <Stack gap="300">
      <Text fontSize="xl" fontWeight="bold">
        Multiple Custom Palettes
      </Text>
      <PaletteSwatches name="ocean" palette={oceanPalette.light} />
      <PaletteSwatches name="sunset" palette={sunsetPalette.light} />
      <Stack direction="row" gap="300">
        <Button colorPalette="primary" variant="solid">
          Primary (ocean)
        </Button>
        <Button colorPalette="warning" variant="solid">
          Warning (sunset)
        </Button>
      </Stack>
      <Text fontSize="md" color="fg">
        "primary" is mapped to the ocean palette (#2A9D8F), "warning" to the
        sunset palette (#E9C46A).
      </Text>
    </Stack>
  ),
};

const customRadiiTheme = createNimbusTheme({
  baseConfigs: [themeConfig],
  palettes: {
    brand: { type: "generated", baseColor: "#264653" },
  },
  semantic: { primary: "brand" },
  tokens: {
    radii: {
      sm: { value: "2px" },
      md: { value: "4px" },
      lg: { value: "8px" },
    },
  },
});

export const TokenOverrides: Story = {
  name: "Token Overrides (Radii)",
  parameters: { nimbusTheme: customRadiiTheme },
  render: () => (
    <Stack gap="300">
      <Text fontSize="xl" fontWeight="bold">
        Token Overrides: Custom Radii + Brand Color
      </Text>
      <Stack direction="row" gap="300">
        <Button colorPalette="primary" variant="solid">
          Custom Radii Button
        </Button>
        <Button colorPalette="primary" variant="outline">
          Primary Outline
        </Button>
        <Button colorPalette="primary" variant="subtle">
          Primary Subtle
        </Button>
      </Stack>
      <Text fontSize="md" color="fg">
        Border radii overridden to sm=2px, md=4px, lg=8px. Primary color is
        #264653.
      </Text>
    </Stack>
  ),
};
