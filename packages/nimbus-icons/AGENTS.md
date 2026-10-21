# Nimbus Icons

## Package Overview

The `@commercetools/nimbus-icons` package provides SVG icons as React components:
- Material Design Icons (outlined variant) - Auto-generated from @material-design-icons/svg
- Custom commercetools icons - Hand-crafted for brand-specific needs
- Generated using SVGR from SVG files to React components
- Outputs both ESM and CJS formats for compatibility

## Build Process

### Build Commands

```bash
# Build from root
pnpm --filter @commercetools/nimbus-icons build

# Or step-by-step
pnpm --filter @commercetools/nimbus-icons build:icons  # Generate React components from SVGs
pnpm --filter @commercetools/nimbus-icons build:esm    # Build ESM bundle
pnpm --filter @commercetools/nimbus-icons build:cjs    # Build CJS bundle
```

### Build Pipeline

1. **Material Icons** → Downloaded from `@material-design-icons/svg` package
2. **SVGR Transform** → Converts SVG files to React components with TypeScript
3. **Compilation** → Builds both ESM and CJS bundles for distribution

## Icon Structure

### Generated Files

```
packages/nimbus-icons/
├── src/
│   ├── material-icons/    # Auto-generated Material Design icons
│   │   ├── account-circle.tsx
│   │   ├── arrow-forward.tsx
│   │   └── ...
│   ├── custom-icons/      # Hand-crafted custom icons
│   │   └── custom-logo.tsx
│   └── index.ts           # Barrel export
├── dist/
│   ├── esm/               # ESM build output
│   └── cjs/               # CJS build output
└── package.json
```

### Naming Convention

Icons use kebab-case filenames matching Material Design naming:
- `account-circle.tsx` → `AccountCircle` component
- `arrow-forward.tsx` → `ArrowForward` component
- `delete-outlined.tsx` → `DeleteOutlined` component

Component names are PascalCase exports.

## Adding New Icons

### Adding Material Design Icons

Material Design icons are automatically available from the `@material-design-icons/svg` package.

1. **Find the icon** at https://fonts.google.com/icons
   - Use "outlined" variant (default for Nimbus)
   - Note the exact icon name (e.g., "account_circle")

2. **Verify availability**
   ```bash
   # Check if icon exists in node_modules
   ls node_modules/@material-design-icons/svg/outlined/ | grep account_circle
   ```

3. **Generate the component**
   ```bash
   pnpm --filter @commercetools/nimbus-icons build:icons
   ```

4. **Icon is auto-generated** in `src/material-icons/`

5. **Export** from `src/index.ts` (may be automatic)
   ```typescript
   export { AccountCircle } from './material-icons/account-circle'
   ```

6. **Build the package**
   ```bash
   pnpm --filter @commercetools/nimbus-icons build
   ```

### Adding Custom Icons

For brand-specific or custom icons:

1. **Create SVG file** or create React component directly in `src/custom-icons/`

2. **If using SVG**, convert manually or use SVGR:
   ```bash
   npx @svgr/cli --icon --typescript custom-icon.svg
   ```

3. **Or create React component manually**:
   ```typescript
   // src/custom-icons/custom-logo.tsx
   import type { SVGProps } from 'react'

   export function CustomLogo(props: SVGProps<SVGSVGElement>) {
     return (
       <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         fill="currentColor"
         {...props}
       >
         <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
       </svg>
     )
   }
   ```

4. **Export** from `src/index.ts`:
   ```typescript
   export { CustomLogo } from './custom-icons/custom-logo'
   ```

5. **Build the package**:
   ```bash
   pnpm --filter @commercetools/nimbus-icons build
   ```

### Custom Icon Guidelines

- Use `viewBox="0 0 24 24"` for consistency (24x24 grid)
- Use `fill="currentColor"` to inherit text color
- Accept `SVGProps<SVGSVGElement>` for flexibility
- Spread `{...props}` to allow customization
- Follow PascalCase naming for components
- Include proper TypeScript types

## Icon Usage

### In Components

```typescript
// Import specific icons
import { AccountCircle, ArrowForward, Delete } from '@commercetools/nimbus-icons'

function MyComponent() {
  return (
    <div>
      <AccountCircle width={24} height={24} />
      <ArrowForward width={16} height={16} color="blue" />
      <Delete width={20} height={20} className="icon-delete" />
    </div>
  )
}
```

### Styling

Icons inherit color from CSS `color` property:

```tsx
// Icons use fill="currentColor"
<div style={{ color: 'red' }}>
  <Delete width={24} height={24} />
</div>
```

Or apply directly:

```tsx
<Delete width={24} height={24} fill="red" />
```

### Sizing

Always specify width and height:

```tsx
// Recommended sizes
<Icon width={16} height={16} />  // Small
<Icon width={20} height={20} />  // Medium
<Icon width={24} height={24} />  // Large
<Icon width={32} height={32} />  // Extra large
```

### In Nimbus Components

Icons are used throughout Nimbus components:

```typescript
// In a Button component
import { ArrowForward } from '@commercetools/nimbus-icons'

<Button>
  Next <ArrowForward width={16} height={16} />
</Button>
```

## Dependencies

This package:
- Has minimal dependencies (@material-design-icons/svg for source icons)
- Does not depend on tokens or nimbus packages
- Can build independently
- Is consumed as a dependency by nimbus

## Common Tasks

### Find Available Icons

```bash
# List all Material icons
ls packages/nimbus-icons/src/material-icons/

# Search for specific icon
ls packages/nimbus-icons/src/material-icons/ | grep arrow
```

### Update Material Icons Version

1. Update `@material-design-icons/svg` in package.json
2. Run `pnpm install`
3. Rebuild icons: `pnpm --filter @commercetools/nimbus-icons build:icons`
4. Rebuild package: `pnpm --filter @commercetools/nimbus-icons build`

### Replace Custom Icon

1. Update SVG in `src/custom-icons/[icon-name].tsx`
2. Rebuild package: `pnpm --filter @commercetools/nimbus-icons build`
3. Rebuild consuming packages if needed

## Troubleshooting

### Icon Not Found

1. Verify icon name matches Material Design naming
2. Check it exists: `ls node_modules/@material-design-icons/svg/outlined/`
3. Regenerate: `pnpm --filter @commercetools/nimbus-icons build:icons`
4. Check export in `src/index.ts`

### Icon Rendering Issues

- Ensure width/height are specified
- Check viewBox is "0 0 24 24"
- Verify `fill="currentColor"` is used
- Test with explicit color: `fill="black"`
