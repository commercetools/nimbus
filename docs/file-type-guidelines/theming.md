# Theming Guidelines

Internal guidelines for developing and maintaining the Nimbus theming system.

## Architecture

### Package: `@commercetools/nimbus-theme-generator`

Located at `packages/nimbus-theme-generator/`. This package provides the color
generation engine and the `createNimbusTheme()` API that consumers use to build
custom Chakra UI systems.

### Color Generation Algorithm

The generator converts a single base hex color into a Radix-compatible 12-step
scale using the OKLCH color space (perceptually uniform lightness).

**Key file:** `src/generate-color-scale.ts`

1. The base color maps to **step 9** (the solid background shade in Radix's
   system)
2. Light mode uses target lightness values from 0.99 (step 1) down to 0.27
   (step 12)
3. Dark mode inverts the curve: 0.15 (step 1) up to 0.93 (step 12)
4. Chroma (saturation) scales relative to the base color — steps far from the
   base lightness get reduced chroma to avoid garish tints
5. `clampChroma()` from culori ensures all colors are within the sRGB gamut
6. Contrast color is white or black, chosen by highest WCAG contrast ratio
   against step 9

### Integration with Nimbus

The `createNimbusTheme()` function builds a Chakra `SystemContext`:

```
createSystem(defaultBaseConfig, ...baseConfigs, overrideConfig)
```

Where:

- `defaultBaseConfig` is Chakra's base config
- `baseConfigs` is typically `[themeConfig]` from `@commercetools/nimbus` (all
  Nimbus recipes, tokens, semantic tokens)
- `overrideConfig` contains the custom palettes as semantic tokens and any token
  overrides

Custom palettes are injected as **semantic tokens** (not base tokens) because
they need `_light`/`_dark` mode discrimination, which only semantic tokens
support in Chakra v3.

### NimbusProvider `theme` Prop

The `NimbusProvider` accepts an optional `theme` prop. When provided, it
replaces the default Nimbus system in the `ChakraProvider`. This is the consumer
entry point for custom themes.

**Key file:**
`packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx`

## Adding a New Palette Type

To add a new palette configuration type (e.g., `preset` for Radix presets):

1. Add the type to `PaletteConfig` union in `src/types.ts`
2. Handle the new type in `resolvePalette()` in `src/create-nimbus-theme.ts`
3. Add tests in `src/create-nimbus-theme.spec.ts`
4. Update the consumer documentation in `docs/theming-guide.md`

## Adding a New Token Override Category

To support overriding a new token category (e.g., `shadows`):

1. Add the property to `TokenOverrides` in `src/types.ts`
2. No changes needed to `buildTokenOverrides()` — it iterates dynamically
3. Add a test case in `src/create-nimbus-theme.spec.ts`
4. Update the consumer documentation

## Testing Requirements

All changes to the theming system must have:

- **Unit tests** for any new or changed generation logic
- **WCAG validation tests** for any changes to the lightness curve or contrast
  calculation
- **Type checking** must pass:
  `pnpm --filter @commercetools/nimbus-theme-generator typecheck`

Run the generator tests:

```bash
cd packages/nimbus-theme-generator
pnpm exec vitest run
```

## Key Files

| File                          | Purpose                                 |
| ----------------------------- | --------------------------------------- |
| `src/generate-color-scale.ts` | OKLCH-based 12-step scale generation    |
| `src/contrast.ts`             | WCAG contrast ratio + contrast color    |
| `src/validate-palette.ts`     | WCAG AA validation for generated scales |
| `src/create-nimbus-theme.ts`  | Consumer API, Chakra system assembly    |
| `src/types.ts`                | All type definitions for the public API |

## Dependencies

- **culori** — Color manipulation in OKLCH space, gamut clamping
- **@chakra-ui/react** — `createSystem`, `defineConfig` for system assembly
- **@commercetools/nimbus** — `themeConfig` export (peer dependency, consumers
  pass it via `baseConfigs`)
