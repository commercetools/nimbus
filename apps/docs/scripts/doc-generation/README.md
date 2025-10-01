# Documentation Generation System

This directory contains scripts for generating Nimbus component documentation.

## Overview

The documentation system consists of three main processes:

1. **Type Extraction** (`parse-types.ts`) - Extracts TypeScript prop types using `react-docgen-typescript`
2. **Recipe Props Injection** (`inject-recipe-props.ts`) - Automatically injects Chakra UI recipe variant props
3. **MDX Processing** (`parse-mdx.ts`) - Processes MDX documentation files

## The Recipe Props Problem

### Challenge

When components use Chakra UI's `RecipeVariantProps<typeof recipe>` pattern, the TypeScript documentation generator doesn't expand these utility types into concrete prop names. This causes recipe variant props (like `size`, `variant`, `tone`) to be invisible in the generated documentation.

**Example of the problem:**
```typescript
// alert.types.tsx
type AlertVariantProps = AlertRootProps & RecipeVariantProps<typeof alertRecipe>;

export interface AlertProps extends PropsWithChildren<AlertVariantProps> {
  // tone and variant props are NOT visible to doc generator
}
```

The doc generator sees `RecipeVariantProps` as an opaque type and can't extract `tone: "critical" | "info" | "warning" | "positive"`.

### Solution

The `inject-recipe-props.ts` script post-processes the generated `types.json` file:

1. **Scans components** in types.json
2. **Loads their recipes** dynamically from the filesystem
3. **Extracts variant definitions** from the recipe's `variants` object
4. **Injects props** as explicit entries in types.json

This approach:
- ✅ **Fully automated** - No manual maintenance required
- ✅ **Single source of truth** - Recipes remain the authoritative definition
- ✅ **Zero duplication** - No need to manually list variants in type files
- ✅ **Always in sync** - Runs on every build and during development

## How Recipe Injection Works

### 1. Recipe Structure

Recipes export variant definitions:

```typescript
// alert.recipe.tsx
export const alertRecipe = defineSlotRecipe({
  // ...
  variants: {
    tone: {
      critical: { /* styles */ },
      info: { /* styles */ },
      warning: { /* styles */ },
      positive: { /* styles */ },
    },
    variant: {
      flat: { /* styles */ },
      outlined: { /* styles */ },
    },
  },
  defaultVariants: {
    tone: "info",
    variant: "flat",
  },
});
```

### 2. Automated Extraction

The script:

```typescript
// For each component in types.json
const recipe = await loadRecipe("Alert"); // Dynamically imports alert.recipe.tsx

// Extracts variant keys
Object.keys(recipe.variants) // ["tone", "variant"]

// Extracts options for each variant
Object.keys(recipe.variants.tone) // ["critical", "info", "warning", "positive"]
```

### 3. Prop Injection

Creates explicit prop definitions:

```json
{
  "tone": {
    "name": "tone",
    "type": {
      "name": "\"critical\" | \"info\" | \"warning\" | \"positive\""
    },
    "required": false,
    "description": "Visual tone of the component (default: \"info\")",
    "defaultValue": {
      "value": "\"info\""
    }
  }
}
```

## Build Process

### Production Build

```bash
pnpm build:docs
```

**Steps:**
1. Parse all TypeScript/TSX files → generates `types.json`
2. Parse all MDX files → generates documentation pages
3. **Inject recipe props** → enhances `types.json` with recipe variants
4. Build complete ✨

### Development Mode

```bash
pnpm dev
```

**File watching:**
- When `.ts` or `.tsx` files change → regenerate types → inject recipe props
- When `.mdx` files change → regenerate documentation
- Hot reload reflects changes immediately

## File Structure

```
scripts/
├── build.ts                    # Production build orchestrator
├── dev.ts                      # Development server launcher
└── doc-generation/
    ├── README.md              # This file
    ├── inject-recipe-props.ts # Recipe variant injection
    ├── parse-types.ts         # TypeScript type extraction
    ├── parse-mdx.ts           # MDX documentation processing
    └── watcher.tsx            # File change watcher (dev mode)
```

## Recipe Discovery

The injection script automatically discovers recipes using this pattern:

1. **Component name** → `"Alert"` or `"AlertRoot"`
2. **Strip "Root"** → `"Alert"`
3. **Convert to kebab-case** → `"alert"`
4. **Look for recipe file** → `packages/nimbus/src/components/alert/alert.recipe.tsx`
5. **Import recipe** → `alertRecipe` or `alertSlotRecipe`
6. **Extract variants** → `{ tone: [...], variant: [...] }`

### Naming Conventions

Recipes must follow these conventions to be discovered:

- **File location**: `packages/nimbus/src/components/{component-name}/{component-name}.recipe.tsx`
- **Export name**: `{component}Recipe` or `{component}SlotRecipe`
  - Example: `alertRecipe`, `buttonRecipe`, `menuSlotRecipe`

## Troubleshooting

### Recipe Props Not Appearing

**Check 1: Recipe file exists**
```bash
ls packages/nimbus/src/components/{component}/
# Should see {component}.recipe.tsx or .ts
```

**Check 2: Recipe is properly exported**
```typescript
// In component.recipe.tsx
export const componentRecipe = defineRecipe({ /* ... */ });
// or
export const componentSlotRecipe = defineSlotRecipe({ /* ... */ });
```

**Check 3: Recipe has variants**
```typescript
export const componentRecipe = defineRecipe({
  variants: {  // ← This object must exist
    size: { /* ... */ },
  },
});
```

**Check 4: Build output**
```bash
pnpm build:docs
# Look for: "✓ Injected {prop} prop into {Component}"
```

### Import Errors During Injection

Some recipes may have import dependencies that aren't available during doc generation (e.g., token imports, internal utilities). These are automatically skipped with no impact on the final documentation.

## Maintenance

### Adding New Components

✅ **No action required!**

If your component follows the standard structure:
- Has a recipe file at the correct location
- Uses standard naming conventions
- Recipe is properly exported

The injection will happen automatically.

### Modifying Recipe Variants

✅ **No action required!**

Just update your recipe file:
```typescript
export const componentRecipe = defineRecipe({
  variants: {
    size: {
      xs: { /* ... */ },  // ← Add new variant
      sm: { /* ... */ },
      md: { /* ... */ },
    },
  },
});
```

Next build will automatically include the new variant in documentation.

### Custom Variant Documentation

To add custom descriptions for variant props, edit `inject-recipe-props.ts`:

```typescript
function createVariantProp(variantName, variantOptions, defaultValue) {
  // Customize descriptions based on variant name
  const descriptions = {
    tone: "Sets the semantic color palette",
    size: "Controls the component size",
    variant: "Visual style variant",
  };

  return {
    description: descriptions[variantName] || `Visual ${variantName} of the component`,
    // ...
  };
}
```

## Related Documentation

- [Component Guidelines](../../../../docs/component-guidelines.md) - Component structure
- [Recipe Guidelines](../../../../docs/file-type-guidelines/recipes.md) - Creating recipes
- [Type Guidelines](../../../../docs/file-type-guidelines/types.md) - Type definitions
