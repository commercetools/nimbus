# Nimbus Icons Package

SVG icon components for the Nimbus design system, providing Material Design icons and custom icons as React components.

## RFC 2119 Compliance

**This file and all icons documentation MUST be interpreted according to [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).**

Key words: **MUST** / **MUST NOT** / **SHOULD** / **SHOULD NOT** / **MAY** (see root CLAUDE.md for definitions)

## Quick Commands

```bash
# Build icons
pnpm --filter @commercetools/nimbus-icons build

# Type checking
pnpm --filter @commercetools/nimbus-icons typecheck

# Clean build artifacts
pnpm --filter @commercetools/nimbus-icons clean
```

## Package Overview

**Purpose:** Generate React components from SVG icon files

**Build Outputs:**
- React components (`dist/icons/*.tsx`)
- TypeScript declarations (`dist/**/*.d.ts`)
- Index barrel export (`dist/index.ts`)

## Icon Sources

### Material Design Icons
- **Source**: Google Material Icons (Outlined, 24x24px)
- **Count**: 2000+ icons
- **Naming**: PascalCase (e.g., `Add`, `Delete`, `Edit`)
- **Location**: `src/svg/material/`

### Custom Icons
- **Source**: Custom SVG files
- **Requirements**: 24x24px viewBox, optimized SVG
- **Location**: `src/svg/custom/`

## Using Icons

### In Nimbus Components (Recommended)

```typescript
import { Icons } from '@commercetools/nimbus';

<Button>
  <Icons.Add />
  Add Item
</Button>
```

### Direct Import (Tree-shakeable)

```typescript
import { Add, Delete, Edit } from '@commercetools/nimbus-icons';

<Add width={24} height={24} color="currentColor" />
```

## Adding New Icons

### Material Icons

1. Find icon at [Material Icons](https://fonts.google.com/icons)
2. Download SVG (Outlined style, 24px)
3. Place in `src/svg/material/` with kebab-case name (e.g., `arrow-forward.svg`)
4. **YOU MUST build:** `pnpm --filter @commercetools/nimbus-icons build`
5. Use: `<Icons.ArrowForward />`

### Custom Icons

1. Create SVG with 24x24px viewBox
2. Optimize (remove IDs, classes, inline styles)
3. Use `currentColor` for fills/strokes
4. Place in `src/svg/custom/`
5. **YOU MUST build:** `pnpm --filter @commercetools/nimbus-icons build`

## SVG Requirements (CRITICAL)

⚠️ **YOU MUST ensure SVGs meet these requirements:**

```svg
<!-- ✅ Valid SVG -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="M..." />
</svg>

<!-- ❌ Invalid - wrong viewBox -->
<svg viewBox="0 0 48 48">
  <path d="M..." />
</svg>

<!-- ❌ Invalid - hardcoded colors -->
<svg viewBox="0 0 24 24">
  <path fill="#000000" d="M..." />
</svg>
```

**Requirements:**
- **MUST** have `viewBox="0 0 24 24"`
- **MUST** use `currentColor` for fills/strokes (enables color theming)
- **MUST NOT** have hardcoded colors, IDs, or classes
- **SHOULD** be optimized (SVGO recommended)

## File Naming

**YOU MUST use kebab-case for SVG files:**
- `arrow-forward.svg` → generates `ArrowForward` component
- `check-circle.svg` → generates `CheckCircle` component
- `account-box.svg` → generates `AccountBox` component

## Icon Generation Process

```
Source SVG Files      SVGR Transform      React Components      Index Barrel
(src/svg/)       →    (SVG → React)   →   (dist/icons/)     →   (dist/index.ts)
```

**Build command:** `pnpm --filter @commercetools/nimbus-icons build`

## File Structure

```
packages/nimbus-icons/
├── src/
│   ├── svg/                 # Source SVGs (YOU MUST edit these)
│   │   ├── material/       # Material Design icons
│   │   └── custom/         # Custom icons
│   ├── generate.ts         # Generation script
│   └── template.tsx        # Component template
└── dist/                   # Generated (DO NOT edit)
    ├── icons/              # React components
    └── index.ts            # Barrel export
```

## SVG Optimization

**YOU SHOULD optimize SVGs before adding:**

```bash
# Using SVGO (recommended)
npx svgo icon.svg

# Or online tools
# https://jakearchibald.github.io/svgomg/
```

**Optimization removes:**
- Unnecessary metadata
- Comments
- Hidden elements
- Default values
- Minifies paths

## Performance

**Tree-shaking works automatically:**
```typescript
// Only imports Add component, not all 2000+ icons
import { Add } from '@commercetools/nimbus-icons';
```

## Common Issues

### Icon Not Showing
**YOU MUST:**
1. Verify SVG is in correct directory (`src/svg/material/` or `src/svg/custom/`)
2. Rebuild: `pnpm --filter @commercetools/nimbus-icons build`
3. Check import: `import { IconName } from '@commercetools/nimbus-icons'`

### Icon Wrong Size/Color
**YOU MUST:**
1. Verify `viewBox="0 0 24 24"` in source SVG
2. Verify `fill="currentColor"` or `stroke="currentColor"` in SVG
3. Set `width`, `height`, `color` props on component

### Build Fails
**YOU SHOULD:**
1. Check SVG syntax validity
2. Ensure file naming is kebab-case
3. Verify no duplicate icon names
4. Check console errors for specific issues

### Icon Distorted
**YOU MUST:**
1. Use 24x24px viewBox (not 48x48, 20x20, etc.)
2. Scale artwork to fit 24x24 grid
3. Use vector paths, not raster images

## Integration with Nimbus

Icons are re-exported through Nimbus package:

```typescript
// In packages/nimbus/src/index.ts
export * as Icons from '@commercetools/nimbus-icons';

// Usage in apps
import { Icons } from '@commercetools/nimbus';
<Icons.Add />
```

## Related Documentation

- **[Root CLAUDE.md](../../CLAUDE.md)** - Monorepo overview
- **[Material Icons](https://fonts.google.com/icons)** - Icon source
- **[SVGR Documentation](https://react-svgr.com/)** - SVG transformation tool

---

For SVGR configuration details and custom generation patterns, see the package README.
