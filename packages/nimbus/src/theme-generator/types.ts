export type ColorStep =
  "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type ColorScale = Record<ColorStep, string>;

export type ColorPalette = ColorScale & {
  DEFAULT: string;
  contrast: string;
};

export type ColorPaletteWithModes = {
  light: ColorPalette;
  dark: ColorPalette;
};

export type GeneratedPaletteConfig = {
  type: "generated";
  baseColor: string;
};

export type ManualPaletteConfig = {
  type: "manual";
  light: ColorScale & { contrast?: string };
  dark: ColorScale & { contrast?: string };
};

export type PresetPaletteConfig = {
  type: "preset";
  preset: string;
};

export type PaletteConfig =
  GeneratedPaletteConfig | ManualPaletteConfig | PresetPaletteConfig;

export type SemanticName =
  "primary" | "neutral" | "info" | "critical" | "warning" | "positive";

export type TokenOverrides = {
  fonts?: Record<string, { value: string }>;
  fontSizes?: Record<string, { value: string }>;
  fontWeights?: Record<string, { value: string }>;
  lineHeights?: Record<string, { value: string }>;
  letterSpacings?: Record<string, { value: string }>;
  spacing?: Record<string, { value: string }>;
  sizes?: Record<string, { value: string }>;
  radii?: Record<string, { value: string }>;
  borders?: Record<string, { value: string }>;
};

export type ThemeConfig = {
  palettes?: Record<string, PaletteConfig>;
  semantic?: Partial<Record<SemanticName, string>>;
  tokens?: TokenOverrides;
  baseConfigs?: unknown[];
};

export type ValidationResult = {
  valid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
};

export type ValidationWarning = {
  step: string;
  contrastRatio: number;
  required: number;
  message: string;
};

export type ValidationError = {
  message: string;
};
