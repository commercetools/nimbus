# Design Tokens Package

Design token definitions for the Nimbus design system using Style Dictionary and the DTCG (Design Tokens Community Group) format.

## RFC 2119 Compliance

**This file and all token documentation MUST be interpreted according to [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).**

Key words: **MUST** / **MUST NOT** / **SHOULD** / **SHOULD NOT** / **MAY** (see root CLAUDE.md for definitions)

## Quick Commands

```bash
# Build tokens
pnpm --filter @commercetools/nimbus-tokens build

# Type checking
pnpm --filter @commercetools/nimbus-tokens typecheck

# Clean build artifacts
pnpm --filter @commercetools/nimbus-tokens clean
```

## Package Overview

**Purpose:** Define and generate design tokens for consistent theming

**Build Outputs:**
- TypeScript definitions (`dist/index.ts`, `dist/index.d.ts`)
- CSS custom properties (`dist/tokens.css`)
- Chakra UI theme tokens
- JSON tokens

## Build Dependencies (⚠️ CRITICAL)

⚠️ **YOU MUST build this package FIRST or all builds will fail:**

```bash
# From root
pnpm build:tokens

# Or directly
pnpm --filter @commercetools/nimbus-tokens build
```

**Why:** Nimbus components and docs depend on these tokens for styling.

## Token System

**Six token categories:**
1. **Spacing** - Padding, margin, gaps (4px, 8px, 12px, ...)
2. **Colors** - Semantic, brand, and system colors (25 Radix scales)
3. **Typography** - Font sizes, weights, line heights
4. **Border Radius** - Corner rounding values
5. **Shadows** - Box shadow definitions
6. **Animations** - Duration and timing values

**Location:** `data/*.json` files

**Example DTCG format:**
```json
{
  "spacing": {
    "400": {
      "$type": "dimension",
      "$value": "16px",
      "$description": "Base spacing unit"
    }
  }
}
```

See [data/](./data/) for complete token definitions.

## Development Workflow

### Adding/Modifying Tokens

1. Edit JSON file in `data/` with DTCG format
2. **YOU MUST build:** `pnpm --filter @commercetools/nimbus-tokens build`
3. **YOU MUST rebuild dependents:** `pnpm build:packages`
4. Verify in Storybook: `pnpm start:storybook`

### DTCG Token Format (REQUIRED)

**YOU MUST include `$type` and `$value` properties:**

```json
// ✅ Valid
{
  "spacing100": {
    "$type": "dimension",
    "$value": "4px"
  }
}

// ❌ Invalid - missing $type
{
  "spacing100": {
    "$value": "4px"
  }
}
```

**Token types:** `dimension`, `color`, `number`, `duration`, `shadow`, `fontFamily`, `fontWeight`

## Token Naming Conventions

**YOU SHOULD use semantic names** describing purpose:
```json
{
  "colors": {
    "text": {
      "primary": { "$type": "color", "$value": "#1a1a1a" }
    }
  }
}
```

**OR scale-based names** for related values:
```json
{
  "spacing": {
    "100": { "$type": "dimension", "$value": "4px" },
    "200": { "$type": "dimension", "$value": "8px" }
  }
}
```

## Color System

**All color scales follow 1-12 + contrast pattern:**
- `1` - Lightest
- `9` - Primary/Solid
- `11` - Text
- `12` - Darkest
- `contrast` - Contrast text

**Dark mode:** Automatically adapts via CSS custom properties in `[data-theme="dark"]`

## File Structure

```
packages/tokens/
├── data/                    # Source DTCG tokens (YOU MUST edit these)
│   ├── spacing.json
│   ├── colors.json
│   ├── typography.json
│   └── ...
├── src/
│   └── style-dictionary.config.ts  # Build configuration
└── dist/                    # Generated outputs (DO NOT edit)
    ├── index.ts            # TypeScript tokens
    └── tokens.css          # CSS custom properties
```

## Integration with Nimbus

```typescript
// In Nimbus recipes
export const buttonRecipe = defineRecipe({
  base: {
    padding: "400",           // Uses spacing.400 token
    fontSize: "400",          // Uses fontSize.400 token
    borderRadius: "200",      // Uses radii.200 token
    backgroundColor: "primary.9"  // Uses colors.primary.9 token
  }
});
```

## Common Issues

### Tokens Not Updating
**YOU MUST:**
1. Clean: `pnpm --filter @commercetools/nimbus-tokens clean`
2. Rebuild: `pnpm --filter @commercetools/nimbus-tokens build`
3. Rebuild dependents: `pnpm build:packages`

### Invalid Token Format
**YOU MUST:**
1. Validate JSON syntax
2. Ensure `$type` property exists
3. Check value format matches type
4. Review [DTCG spec](https://design-tokens.github.io/community-group/format/)

### Build Fails
**YOU SHOULD:**
1. Check console errors
2. Validate Style Dictionary config in `src/style-dictionary.config.ts`
3. Ensure all token references exist
4. Run `pnpm install`

## Related Documentation

- **[Root CLAUDE.md](../../CLAUDE.md)** - Monorepo overview
- **[Style Dictionary Docs](https://amzn.github.io/style-dictionary/)** - Transformation tool
- **[DTCG Specification](https://design-tokens.github.io/community-group/format/)** - Token format standard

---

For Style Dictionary configuration details and advanced token patterns, see the package README.
