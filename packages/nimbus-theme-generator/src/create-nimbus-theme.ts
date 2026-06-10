import type { SystemConfig } from "@chakra-ui/react/styled-system";
import { createSystem, defineConfig } from "@chakra-ui/react/styled-system";
import { defaultBaseConfig } from "@chakra-ui/react/preset-base";
import { generateColorScale } from "./generate-color-scale.ts";
import { calculateContrastColor } from "./contrast.ts";
import type {
  ThemeConfig,
  PaletteConfig,
  SemanticName,
  TokenOverrides,
  ColorPaletteWithModes,
} from "./types.ts";

type SemanticTokenValue =
  | { value: { _light: string; _dark: string } }
  | { value: string };

type SemanticTokenPalette = Record<string, SemanticTokenValue>;

function resolvePalette(config: PaletteConfig): ColorPaletteWithModes {
  if (config.type === "generated") {
    return generateColorScale(config.baseColor);
  }

  if (config.type === "manual") {
    const lightContrast =
      config.light.contrast ?? calculateContrastColor(config.light["9"]);
    const darkContrast =
      config.dark.contrast ?? calculateContrastColor(config.dark["9"]);
    return {
      light: {
        ...config.light,
        DEFAULT: config.light["9"],
        contrast: lightContrast,
      },
      dark: {
        ...config.dark,
        DEFAULT: config.dark["9"],
        contrast: darkContrast,
      },
    };
  }

  throw new Error(
    `Preset palette type "${(config as PaletteConfig & { type: "preset" }).preset}" is not yet supported. Use "generated" or "manual" instead.`
  );
}

function paletteToSemanticTokens(
  palette: ColorPaletteWithModes
): SemanticTokenPalette {
  const result: SemanticTokenPalette = {};
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
    "DEFAULT",
    "contrast",
  ];

  for (const step of steps) {
    const lightVal = palette.light[step as keyof typeof palette.light];
    const darkVal = palette.dark[step as keyof typeof palette.dark];
    result[step] = { value: { _light: lightVal, _dark: darkVal } };
  }

  return result;
}

function createSemanticReference(sourcePalette: string): SemanticTokenPalette {
  const result: SemanticTokenPalette = {};
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
    "DEFAULT",
    "contrast",
  ];

  for (const step of steps) {
    result[step] = { value: `{colors.${sourcePalette}.${step}}` };
  }

  return result;
}

export function palettesToSemanticTokens(
  palettes: Record<string, PaletteConfig>,
  semantic?: Partial<Record<SemanticName, string>>
): Record<string, SemanticTokenPalette> {
  const result: Record<string, SemanticTokenPalette> = {};

  for (const [name, config] of Object.entries(palettes)) {
    const resolved = resolvePalette(config);
    result[name] = paletteToSemanticTokens(resolved);
  }

  if (semantic) {
    for (const [semanticName, paletteName] of Object.entries(semantic)) {
      result[semanticName] = createSemanticReference(paletteName);
    }
  }

  return result;
}

export function buildTokenOverrides(
  overrides: TokenOverrides | undefined
): Record<string, unknown> {
  if (!overrides) return {};

  const result: Record<string, unknown> = {};
  for (const [category, values] of Object.entries(overrides)) {
    if (values && Object.keys(values).length > 0) {
      result[category] = values;
    }
  }
  return result;
}

export function createNimbusTheme(config: ThemeConfig) {
  const colorTokens = config.palettes
    ? palettesToSemanticTokens(config.palettes, config.semantic)
    : {};

  const tokenOverrides = buildTokenOverrides(config.tokens);

  const overrideConfig = defineConfig({
    cssVarsPrefix: "nimbus",
    cssVarsRoot: ":where(:root, :host)",
    theme: {
      semanticTokens: {
        colors: colorTokens,
      },
      tokens: tokenOverrides,
    },
  });

  const baseConfigs = (config.baseConfigs ?? []) as SystemConfig[];
  return createSystem(defaultBaseConfig, ...baseConfigs, overrideConfig);
}
