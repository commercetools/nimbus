# Color Tokens

## Package Overview

The `color-tokens` package is a **private utility package** that generates brand-specific color definitions:
- Sources base colors from Radix UI Colors
- Applies custom color transformations using chroma-js
- Feeds generated colors into `@commercetools/nimbus-tokens`
- Provides type-safe color scale generation

**Note**: This is a private package not published to npm - it's used internally in the monorepo only.

## Purpose

This package serves as a color generation layer between:
1. **Radix UI Colors** (source palette) →
2. **color-tokens** (transformation/generation) →
3. **@commercetools/nimbus-tokens** (design token system)

It allows customizing and extending the Radix color system to match brand requirements while maintaining consistency.

## Build Process

### Type Checking

```bash
# Type check from root
pnpm --filter color-tokens typecheck

# Or from package
cd packages/color-tokens
pnpm typecheck
```

**Note**: This package doesn't have a build step - it's TypeScript source consumed directly by the tokens package during its build process.

## Color Generation

### Source Files

```
packages/color-tokens/
├── index.ts           # Main color generation logic
├── scales.ts          # Color scale definitions
├── transformers.ts    # Color transformation utilities
├── package.json
└── tsconfig.json
```

### How Colors Are Generated

```typescript
// Simplified example of color generation
import * as radixColors from '@radix-ui/colors'
import chroma from 'chroma-js'

// 1. Import Radix base colors
const radixBlue = radixColors.blue

// 2. Apply brand-specific transformations
export const brandBlue = {
  50: chroma(radixBlue.blue1).brighten(0.5).hex(),
  100: radixBlue.blue2,
  200: radixBlue.blue3,
  // ... through 900
}

// 3. Export for tokens package consumption
export const brandColors = {
  blue: brandBlue,
  red: brandRed,
  // etc.
}
```

### Color Scale Structure

Colors follow a numeric scale (50-900) matching common design token conventions:

```typescript
export interface ColorScale {
  50: string   // Lightest
  100: string
  200: string
  300: string
  400: string
  500: string  // Base/primary shade
  600: string
  700: string
  800: string
  900: string  // Darkest
}
```

## Dependencies

### Key Dependencies

- **@radix-ui/colors** - Base color palette (high-quality, accessible colors)
- **chroma-js** - Color manipulation and transformation utilities
- **lodash** - Utility functions for color scale generation

### Why Radix Colors?

Radix UI Colors provides:
- Accessible color scales (tested for WCAG compliance)
- Consistent steps between shades
- Dark mode variants
- Scientifically designed perceptual uniformity

## How It's Used

### In @commercetools/nimbus-tokens

The tokens package imports from color-tokens during its build:

```typescript
// In @commercetools/nimbus-tokens/src/colors.json
// Or in a build script
import { brandColors } from 'color-tokens'

// Use in token definitions
export const tokens = {
  color: {
    primary: {
      value: brandColors.blue[500]
    },
    primaryLight: {
      value: brandColors.blue[300]
    }
  }
}
```

## Customization

### Adding a New Brand Color

1. **Import Radix base color**:
   ```typescript
   import * as radixColors from '@radix-ui/colors'
   ```

2. **Define transformation** (optional):
   ```typescript
   import chroma from 'chroma-js'

   export const brandPurple = {
     50: chroma(radixColors.purple.purple1).brighten(0.3).hex(),
     100: radixColors.purple.purple2,
     // ... continue scale
   }
   ```

3. **Export for consumption**:
   ```typescript
   export const brandColors = {
     blue: brandBlue,
     purple: brandPurple, // Add new color
   }
   ```

4. **Rebuild tokens**:
   ```bash
   pnpm build:tokens
   ```

### Modifying Color Transformations

Edit transformation logic in the package:

```typescript
// Apply saturation boost to all blues
export const brandBlue = Object.entries(radixColors.blue).reduce((acc, [key, value]) => {
  acc[key] = chroma(value)
    .saturate(0.2)    // Increase saturation
    .hex()
  return acc
}, {})
```

### Creating Semantic Color Sets

```typescript
// Generate semantic colors from base palette
export const semanticColors = {
  success: brandColors.green[500],
  warning: brandColors.yellow[500],
  danger: brandColors.red[500],
  info: brandColors.blue[500],
}
```

## Common Tasks

### Update Radix Colors Version

1. Update `@radix-ui/colors` in package.json:
   ```bash
   pnpm --filter color-tokens add @radix-ui/colors@latest
   ```

2. Check for breaking changes in Radix release notes

3. Rebuild tokens:
   ```bash
   pnpm build:tokens
   ```

### Test Color Output

```typescript
// Create a test script in the package
import { brandColors } from './index'

console.log('Primary Blue 500:', brandColors.blue[500])
console.log('All Blues:', brandColors.blue)
```

Run with:
```bash
cd packages/color-tokens
tsx test-colors.ts
```

### Verify Accessibility

Use tools to check color contrast:

```typescript
import chroma from 'chroma-js'

const bg = brandColors.blue[50]
const text = brandColors.blue[900]

const contrast = chroma.contrast(bg, text)
console.log('Contrast ratio:', contrast) // Should be >= 4.5 for WCAG AA
```

## Color Theory Notes

### Perceptual Uniformity

Radix colors are designed with perceptual uniformity - each step in the scale has visually consistent spacing. This means:
- 50 → 100 looks similar in difference to 400 → 500
- Makes it easier to create harmonious UIs
- Reduces need for manual color adjustments

### Transformation Best Practices

When transforming Radix colors:
- **Preserve relative relationships** - don't drastically change one shade without adjusting others
- **Test accessibility** - check contrast ratios after transformations
- **Maintain scale consistency** - keep visual spacing between shades uniform
- **Consider dark mode** - Radix provides dark variants you can also transform

## Integration Flow

```
1. Radix UI Colors (npm package)
   ↓
2. color-tokens (transformation layer)
   ↓
3. @commercetools/nimbus-tokens (design token generation)
   ↓
4. @commercetools/nimbus (component styling)
```

## Troubleshooting

### Type Errors

If TypeScript complains:
1. Ensure `@radix-ui/colors` is installed
2. Check TypeScript version compatibility
3. Verify `chroma-js` types are installed (`@types/chroma-js`)

### Colors Not Updating

If color changes don't appear:
1. Rebuild tokens: `pnpm build:tokens`
2. Rebuild nimbus: `pnpm --filter @commercetools/nimbus build`
3. Clear cache: `pnpm nimbus:reset && pnpm install`
4. Restart dev server

### Unexpected Color Output

If transformed colors look wrong:
1. Log intermediate values during transformation
2. Check chroma-js documentation for transformation methods
3. Verify input color format (hex vs rgb vs hsl)
4. Test transformations in isolation with small script
