# Documentation Build System

Understanding how the Nimbus documentation site build process works, including MDX processing, TypeScript prop extraction, and route generation.

## Overview

The documentation build process uses the `@commercetools/nimbus-docs-build` package to:

1. Scan the Nimbus package for component MDX files
2. Extract TypeScript prop definitions using `react-docgen-typescript`
3. Generate route manifest for navigation
4. Generate props data for PropsTable component
5. Build the documentation site with Vite

## Build Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Nimbus Package                                         │
│  packages/nimbus/src/components/                        │
│  ├── button/                                            │
│  │   ├── button.tsx                                     │
│  │   ├── button.types.ts                                │
│  │   ├── button.mdx                                     │
│  │   └── button.dev.mdx                                 │
│  └── ...                                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  @commercetools/nimbus-docs-build                       │
│  ├── MDX Scanner                                        │
│  │   └── Finds *.mdx, *.guide.mdx, *.dev.mdx, *.a11y.mdx │
│  ├── TypeScript Extractor (react-docgen-typescript)    │
│  │   └── Extracts prop definitions from *.types.ts     │
│  └── Route Generator                                    │
│      └── Creates route manifest from frontmatter        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Generated Data                                         │
│  apps/docs/src/data/                                    │
│  ├── routes.json    # Route manifest                    │
│  └── props.json     # TypeScript prop definitions       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Docs App (Vite Build)                                  │
│  apps/docs/                                             │
│  ├── Reads routes.json for navigation                  │
│  ├── Reads props.json for PropsTable                   │
│  └── Renders MDX files with jsx-live support           │
└─────────────────────────────────────────────────────────┘
```

## Build Process Steps

### Step 1: MDX File Discovery

The build system scans `packages/nimbus/src/components/` for MDX files:

- **`*.mdx`** - Overview page (required)
- **`*.guide.mdx`** - Guidance for designers/UX professionals (optional)
- **`*.dev.mdx`** - Developer-focused implementation details (optional)
- **`*.a11y.mdx`** - Accessibility documentation (optional)

Each MDX file must have valid YAML frontmatter with required fields.

### Step 2: TypeScript Prop Extraction

Uses `react-docgen-typescript` to extract prop definitions:

1. Locates `*.types.ts` files in component directories
2. Parses TypeScript AST to find exported interfaces
3. Extracts prop names, types, descriptions, and default values
4. Generates JSON prop definitions

**Requirements:**
- Props must be in exported TypeScript interfaces
- JSDoc comments are extracted as descriptions
- `@default` tags are parsed for default values

### Step 3: Route Manifest Generation

Creates `routes.json` with navigation structure:

```json
{
  "routes": [
    {
      "id": "Components-Button",
      "title": "Button",
      "path": "/components/inputs/button",
      "menu": ["Components", "Inputs", "Button"],
      "tags": ["component", "button", "input"],
      "views": {
        "main": "/path/to/button.mdx",
        "dev": "/path/to/button.dev.mdx"
      }
    }
  ]
}
```

### Step 4: Props Data Generation

Creates `props.json` with extracted TypeScript definitions:

```json
{
  "Button": {
    "variant": {
      "name": "variant",
      "type": "\"solid\" | \"outline\" | \"ghost\"",
      "description": "Visual style variant of the button",
      "defaultValue": "\"solid\"",
      "required": false
    },
    "size": {
      "name": "size",
      "type": "\"sm\" | \"md\" | \"lg\"",
      "description": "Size variant of the button",
      "defaultValue": "\"md\"",
      "required": false
    }
  }
}
```

### Step 5: Vite Build

The docs app builds with Vite:

1. Reads generated `routes.json` and `props.json`
2. Sets up React Router routes based on manifest
3. Configures MDX loader for jsx-live support
4. Bundles app with all dependencies
5. Outputs static site to `apps/docs/dist/`

## Build Commands

### Full Documentation Build

```bash
# From root - builds everything
pnpm build:docs
```

This runs:
1. `pnpm --filter @commercetools/nimbus-docs-build build` - Generate data
2. `pnpm --filter docs build` - Build app

### Incremental Builds

```bash
# Only regenerate data (routes + props)
pnpm --filter @commercetools/nimbus-docs-build build

# Only build app (uses existing data)
pnpm --filter docs build
```

### Development Mode

```bash
# Start dev server with HMR
pnpm start:docs

# Or with filter
pnpm --filter docs dev
```

Dev mode watches for changes and hot-reloads without full rebuilds.

## Configuration

### nimbus-docs-build Configuration

Located in `packages/nimbus-docs-build/src/config.ts`:

```typescript
export const config = {
  // Source directory for components
  componentsDir: 'packages/nimbus/src/components',

  // Output directory for generated data
  outputDir: 'apps/docs/src/data',

  // MDX file patterns to scan
  mdxPatterns: ['*.mdx', '*.guide.mdx', '*.dev.mdx', '*.a11y.mdx'],

  // TypeScript file patterns for prop extraction
  typesPatterns: ['*.types.ts'],
};
```

### Vite Configuration

Located in `apps/docs/vite.config.ts`:

- MDX plugin configuration
- jsx-live transformer setup
- Route generation plugin
- Build output settings

## Generated Files

### routes.json Structure

```typescript
type RouteManifest = {
  routes: Array<{
    id: string;                    // Unique identifier from frontmatter
    title: string;                 // Display title
    path: string;                  // URL path
    menu: string[];                // Menu hierarchy
    tags: string[];                // Search tags
    description?: string;          // Brief description
    lifecycleState?: string;       // Component lifecycle
    figmaLink?: string;            // Design resource
    views: {
      main?: string;               // Path to .mdx file
      guide?: string;              // Path to .guide.mdx file
      dev?: string;                // Path to .dev.mdx file
      a11y?: string;               // Path to .a11y.mdx file
    };
  }>;
};
```

### props.json Structure

```typescript
type PropsData = {
  [componentName: string]: {
    [propName: string]: {
      name: string;
      type: string;
      description?: string;
      defaultValue?: string;
      required: boolean;
    };
  };
};
```

## How PropsTable Works

The PropsTable component:

1. Receives `id` prop (component name)
2. Looks up component in `props.json`
3. Renders table of prop definitions
4. Formats types and descriptions

```tsx
// In MDX
<PropsTable id="Button" />

// Component implementation
export const PropsTable = ({ id }: { id: string }) => {
  const propsData = usePropsData(); // Reads props.json
  const componentProps = propsData[id];

  if (!componentProps) {
    return <div>Component "{id}" not found</div>;
  }

  return (
    <table>
      {/* Render prop definitions */}
    </table>
  );
};
```

## Troubleshooting

### PropsTable shows "Component not found"

**Cause:** Component name doesn't match or props not extracted.

**Solutions:**
1. Check that `id` matches exported component name exactly (case-sensitive)
2. Verify component has exported TypeScript interface
3. Rebuild: `pnpm --filter @commercetools/nimbus-docs-build build`
4. Check `apps/docs/src/data/props.json` for component entry

### Routes not updating

**Cause:** Route manifest not regenerated.

**Solutions:**
1. Rebuild docs build: `pnpm --filter @commercetools/nimbus-docs-build build`
2. Check MDX frontmatter is valid YAML
3. Verify `id` field is unique
4. Restart dev server

### MDX file not found

**Cause:** File path or location issue.

**Solutions:**
1. Ensure MDX file is in component directory: `packages/nimbus/src/components/{component}/`
2. Check filename matches pattern: `{component}.mdx`
3. Verify file is not gitignored
4. Rebuild: `pnpm --filter @commercetools/nimbus-docs-build build`

### TypeScript props not extracted

**Cause:** Type definition issues or parser failure.

**Solutions:**
1. Check types are in `{component}.types.ts` file
2. Verify types are exported: `export type ComponentProps = {...}`
3. Ensure JSDoc comments are valid
4. Check for TypeScript syntax errors
5. Rebuild: `pnpm --filter @commercetools/nimbus-docs-build build`

## Build Performance

### Optimization Strategies

1. **Incremental builds**: Only rebuild docs-build when types or MDX change
2. **Parallel execution**: Vite builds in parallel with other packages
3. **Caching**: TypeScript extraction caches parsed ASTs
4. **Selective rebuilds**: Dev mode only rebuilds changed files

### Build Times

Typical build times:

- **docs-build** (data generation): ~5-10 seconds
- **docs** (Vite build): ~20-30 seconds
- **Full build** (both): ~30-40 seconds

Dev mode startup: ~3-5 seconds

## Related Documentation

- [MDX Format](./mdx-format.md) - Writing component documentation
- [PropsTable Component](./props-table.md) - Displaying TypeScript props
- [Development Workflow](./development.md) - Running and building

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript)
- [MDX Documentation](https://mdxjs.com/)
