# Nimbus Design Tokens

## Package Overview

The `@commercetools/nimbus-tokens` package generates design tokens using Style
Dictionary:

- Source tokens in JSON format
- Outputs CSS variables, TypeScript constants, and Chakra UI format
- Consumed by all other packages (must build first in build order)

## Build Process

### Build Commands

```bash
# Build tokens from root (recommended)
pnpm build:tokens

# Or generate tokens directly
pnpm generate:tokens

# Or build directly from package
pnpm --filter @commercetools/nimbus-tokens build
```

### Build Output

The build process generates multiple output formats:

- `dist/` - Compiled token modules for consumption
- `css/` - CSS custom properties
- `generated/ts/` - TypeScript constants
- `generated/chakra/` - Chakra UI format for theme integration

## Token Structure

### Source Files

Tokens are defined in JSON files in `src/`:

- `colors.json` - Color palette (semantic and primitive colors)
- `spacing.json` - Spacing scale (padding, margins, gaps)
- `typography.json` - Font sizes, weights, line heights, font families
- `animations.json` - Animation tokens (durations, easings)
- `borders.json` - Border styles (widths, radii)
- `shadows.json` - Shadow definitions (box-shadow, drop-shadow)

### Style Dictionary Configuration

Configuration lives in `src/style-dictionary.config.js`:

- Custom transforms for token values
- Output formats (CSS, TypeScript, Chakra)
- Build platforms and destinations

## Adding/Modifying Tokens

### Adding a New Token

1. Edit the appropriate JSON file in `src/`
2. Follow existing naming conventions (kebab-case)
3. Use semantic names (e.g., `color-primary`, not `color-blue-500`)
4. Run `pnpm build:tokens` to generate output files
5. Rebuild dependent packages that use the new token

### Token Naming Convention

- Use semantic names that describe purpose, not appearance
- Group related tokens with prefixes
- Follow Chakra UI token structure for compatibility
- Examples:
  - `color-primary` (semantic) vs `color-blue-500` (primitive)
  - `spacing-md` vs `spacing-16px`
  - `fontSize-body` vs `fontSize-14`

### Example Token Definition

```json
{
  "color": {
    "primary": {
      "value": "#0066CC",
      "type": "color",
      "description": "Primary brand color"
    }
  }
}
```

## Token Consumption

### In Chakra UI Recipes

Components consume tokens via Chakra UI recipes:

```typescript
// In a recipe file
import { defineRecipe } from "@chakra-ui/react/styled-system";

export const buttonRecipe = defineRecipe({
  base: {
    fontSize: "nimbus.fontSize.md", // Token reference
    padding: "nimbus.spacing.md", // Token reference
    borderRadius: "nimbus.borderRadius.md",
  },
});
```

### Direct Import

```typescript
// Import tokens directly
import { colors } from "@commercetools/nimbus-tokens";

const primaryColor = colors.primary;
```

### CSS Custom Properties

```css
/* Tokens are available as CSS variables */
.my-component {
  color: var(--nimbus-color-primary);
  padding: var(--nimbus-spacing-md);
}
```

## Build Dependencies

**This package must build before all others** - it's the foundation of the
design system.

Build order:

1. **tokens** (this package) ← Build first
2. All other packages (nimbus, nimbus-icons, etc.)
3. Apps (docs, blank-app)

Without building tokens first, dependent packages will fail because they can't
resolve token imports.

## Common Tasks

### Updating a Color Value

1. Edit `src/colors.json`
2. Find the token (e.g., `color.primary.value`)
3. Update the value
4. Run `pnpm build:tokens`
5. Rebuild nimbus: `pnpm --filter @commercetools/nimbus build`

### Adding a New Spacing Value

1. Edit `src/spacing.json`
2. Add new token following existing pattern
3. Run `pnpm build:tokens`
4. Use in recipes: `padding: 'nimbus.spacing.yourNewToken'`

### Verifying Token Output

After building, check:

- `dist/` - Contains compiled modules
- `generated/ts/tokens.ts` - TypeScript constants
- `generated/chakra/tokens.ts` - Chakra UI theme tokens
- `css/variables.css` - CSS custom properties
