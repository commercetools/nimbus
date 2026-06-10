# Theming Guide

This guide explains how to create custom themes for Nimbus, including custom
color palettes, typography, spacing, and other token overrides.

## Overview

Nimbus uses a 12-step color scale system (based on Radix UI Colors) that
provides a consistent set of shades for each color palette. Each palette
includes light and dark mode variants, ensuring accessibility across color
modes.

The `@commercetools/nimbus-theme-generator` package lets you:

- Generate custom color palettes from a single base hex color
- Define manual palettes with full control over each shade
- Override typography, spacing, radii, and other design tokens
- Remap semantic colors (primary, critical, etc.) to custom palettes

## Quick Start

### 1. Install the generator

```bash
pnpm add @commercetools/nimbus-theme-generator
```

### 2. Create a custom theme

```typescript
// src/theme.ts
import { createNimbusTheme } from "@commercetools/nimbus-theme-generator";
import { themeConfig } from "@commercetools/nimbus";

export const customTheme = createNimbusTheme({
  // Include the default Nimbus theme as a base
  baseConfigs: [themeConfig],

  // Generate a palette from your brand color
  palettes: {
    brand: { type: "generated", baseColor: "#E63946" },
  },

  // Map the semantic "primary" to your brand palette
  semantic: {
    primary: "brand",
  },
});
```

### 3. Pass the theme to NimbusProvider

```tsx
// src/App.tsx
import { NimbusProvider, Button } from "@commercetools/nimbus";
import { customTheme } from "./theme";

function App() {
  return (
    <NimbusProvider theme={customTheme}>
      <Button colorPalette="brand" variant="solid">
        Custom Brand Button
      </Button>
      <Button colorPalette="primary" variant="solid">
        Primary (uses "brand" via semantic mapping)
      </Button>
    </NimbusProvider>
  );
}
```

## Color Palette Configuration

### Generated Palettes

The simplest option. Provide a base hex color and the generator creates a full
12-step scale with light and dark mode variants:

```typescript
createNimbusTheme({
  baseConfigs: [themeConfig],
  palettes: {
    brand: { type: "generated", baseColor: "#E63946" },
  },
});
```

The base color becomes **step 9** (the solid background shade). The generator
uses the OKLCH color space to produce perceptually uniform steps:

| Steps | Purpose                  | Example Usage               |
| ----- | ------------------------ | --------------------------- |
| 1-2   | App/subtle backgrounds   | Page background, card fills |
| 3-5   | UI element backgrounds   | Hover, active, selected     |
| 6-8   | Borders and separators   | Input borders, dividers     |
| 9     | Solid backgrounds        | Button fills, badges        |
| 10    | Hovered solid background | Button hover state          |
| 11-12 | Text colors              | Low-contrast and body text  |

Each palette also includes:

- **DEFAULT**: Alias for step 9
- **contrast**: Black or white — whichever provides higher contrast against step
  9 (always meets WCAG AA 4.5:1)

### Manual Palettes

For full control, define every step explicitly for both light and dark modes:

```typescript
createNimbusTheme({
  baseConfigs: [themeConfig],
  palettes: {
    brand: {
      type: "manual",
      light: {
        "1": "#fef8f4",
        "2": "#fef0e7",
        "3": "#fde5d3",
        "4": "#fcd9bd",
        "5": "#facda5",
        "6": "#f7be8a",
        "7": "#f4ab6a",
        "8": "#ef9340",
        "9": "#FF5733",
        "10": "#e54d2a",
        "11": "#cc3d1a",
        "12": "#5c1d0d",
      },
      dark: {
        "1": "#1f1511",
        "2": "#2a1e19",
        "3": "#3a2820",
        "4": "#4a3327",
        "5": "#5c3f2e",
        "6": "#714c36",
        "7": "#8b5d3f",
        "8": "#a8734a",
        "9": "#FF5733",
        "10": "#ff6d48",
        "11": "#ff8c6f",
        "12": "#fef8f4",
      },
    },
  },
});
```

When using manual palettes, the contrast color is auto-calculated from step 9.
You can also provide it explicitly by adding a `contrast` key to each mode.

## Semantic Color Mappings

Nimbus components use semantic color names like `primary`, `critical`, and
`positive`. You can remap any of these to a custom palette:

```typescript
createNimbusTheme({
  baseConfigs: [themeConfig],
  palettes: {
    brand: { type: "generated", baseColor: "#E63946" },
    success: { type: "generated", baseColor: "#2A9D8F" },
  },
  semantic: {
    primary: "brand",
    positive: "success",
  },
});
```

Available semantic names: `primary`, `neutral`, `info`, `critical`, `warning`,
`positive`.

Any semantic name you don't override keeps its default mapping from the base
Nimbus theme.

## Token Overrides

Beyond colors, you can override typography, spacing, and other design tokens:

```typescript
createNimbusTheme({
  baseConfigs: [themeConfig],
  tokens: {
    fonts: {
      body: { value: '"Roboto", sans-serif' },
      heading: { value: '"Montserrat", sans-serif' },
    },
    fontSizes: {
      md: { value: "1rem" },
      lg: { value: "1.25rem" },
    },
    spacing: {
      "400": { value: "20px" },
      "800": { value: "40px" },
    },
    radii: {
      md: { value: "8px" },
      lg: { value: "12px" },
    },
  },
});
```

Supported token categories: `fonts`, `fontSizes`, `fontWeights`, `lineHeights`,
`letterSpacings`, `spacing`, `sizes`, `radii`, `borders`.

Token overrides are merged with the base theme — you only need to specify the
tokens you want to change.

## Validation

Use `validatePalette()` to check generated or manual palettes for WCAG
compliance:

```typescript
import {
  generateColorScale,
  validatePalette,
} from "@commercetools/nimbus-theme-generator";

const palette = generateColorScale("#E63946");
const result = validatePalette(palette);

if (!result.valid) {
  console.warn("Accessibility issues:", result.warnings);
}
```

The validator checks:

- Contrast color meets WCAG AA (4.5:1) against step 9
- Step 11 (low-contrast text) meets WCAG AA against step 1 (background)
- Step 12 (high-contrast text) meets WCAG AA against step 1 (background)

## API Reference

### `createNimbusTheme(config)`

Creates a Chakra UI system with custom palettes and token overrides.

**Parameters:**

| Property      | Type                                    | Description                               |
| ------------- | --------------------------------------- | ----------------------------------------- |
| `palettes`    | `Record<string, PaletteConfig>`         | Custom color palette definitions          |
| `semantic`    | `Partial<Record<SemanticName, string>>` | Remap semantic colors to palette names    |
| `tokens`      | `TokenOverrides`                        | Override typography, spacing, radii, etc. |
| `baseConfigs` | `unknown[]`                             | Base theme configs (use `[themeConfig]`)  |

**Returns:** A Chakra UI `SystemContext` — pass it as the `theme` prop to
`<NimbusProvider>`.

### `generateColorScale(baseColor)`

Generates a 12-step color scale from a single hex color.

**Parameters:** `baseColor: string` — hex color (e.g. `"#E63946"`)

**Returns:** `{ light: ColorPalette, dark: ColorPalette }` — each containing
steps 1-12, DEFAULT, and contrast.

### `validatePalette(palette)`

Validates a color palette for WCAG AA compliance.

**Parameters:** `palette: ColorPaletteWithModes`

**Returns:**
`{ valid: boolean, warnings: ValidationWarning[], errors: ValidationError[] }`

## Troubleshooting

### Custom palette not showing up

Ensure you included `baseConfigs: [themeConfig]` in your `createNimbusTheme`
call. Without the base Nimbus config, components won't have their recipes and
default tokens.

### Colors look wrong in dark mode

Check that your manual palette has properly inverted lightness values. In dark
mode, step 1 should be the darkest and step 12 the lightest.

### Components not using custom semantic colors

Verify the semantic mapping matches your palette name exactly:

```typescript
// The palette name...
palettes: { myBrand: { type: "generated", baseColor: "#E63946" } },
// ...must match the semantic value
semantic: { primary: "myBrand" },
```

### Font not loading

Token overrides set the CSS `font-family` value, but you still need to load the
font files. Add a `<link>` tag or `@font-face` rule in your application.
