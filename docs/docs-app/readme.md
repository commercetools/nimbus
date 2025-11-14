# Documentation Site (Docs App) Guidelines

This guide provides comprehensive information for developing and maintaining the Nimbus documentation site.

## Overview

The documentation site is a Vite-powered Single Page Application (SPA) that renders component documentation from MDX files, extracts TypeScript prop definitions, and provides interactive code examples.

**Key Technologies:**
- Vite (build tool and dev server)
- React (UI framework)
- React Router (navigation)
- `@commercetools/nimbus-docs-build` (custom build system)
- `react-docgen-typescript` (prop extraction)
- MDX (markdown with JSX)

## Architecture

```
apps/docs/
├── src/
│   ├── components/          # Doc site UI components
│   │   ├── PropsTable.tsx  # TypeScript prop table display
│   │   ├── CodeBlock.tsx   # Syntax-highlighted code
│   │   └── ...
│   ├── pages/              # Route components
│   ├── data/               # Generated data
│   │   ├── routes.json     # Auto-generated route manifest
│   │   └── props.json      # Extracted TypeScript props
│   ├── App.tsx
│   └── main.tsx
├── public/                 # Static assets
└── vite.config.ts          # Vite configuration
```

## Documentation

### Quick Links

- [MDX Format](./mdx-format.md) - Writing component documentation
- [Build System](./build-system.md) - How the build process works
- [PropsTable Component](./props-table.md) - Displaying TypeScript props
- [Interactive Examples](./jsx-live-blocks.md) - Using jsx-live code blocks
- [Development Workflow](./development.md) - Running and building the site

## Development Workflow

### Starting the Dev Server

```bash
# From root
pnpm start:docs

# Or with filter
pnpm --filter docs dev
```

The dev server runs at `http://localhost:5173` with Hot Module Replacement (HMR).

### Building for Production

```bash
# Full build (includes docs build + app build)
pnpm build:docs

# Or build separately
pnpm --filter @commercetools/nimbus-docs-build build  # Generate data
pnpm --filter docs build                               # Build app
```

## Key Concepts

### 1. Multi-View Documentation

Documentation structure is flexible and adapts to the type of item (components, hooks, utils, etc.).

Established pattern for React components:
- **`.mdx`** - Overview page (required)
- **`.guide.mdx`** - Guidance for designers/UX professionals (optional)
- **`.dev.mdx`** - Developer-focused implementation details (optional)
- **`.a11y.mdx`** - Accessibility documentation (optional)

These are colocated with components in `packages/nimbus/src/components/`.

### 2. Build System

The `@commercetools/nimbus-docs-build` package:
- Scans Nimbus package for component MDX files
- Extracts TypeScript props using `react-docgen-typescript`
- Generates route manifest (`routes.json`)
- Generates props data (`props.json`)

### 3. PropsTable Component

Displays TypeScript prop definitions extracted from component files:

```mdx
## API

<PropsTable id="Button" />
```

The `id` parameter matches the component's exported name.

### 4. jsx-live Blocks

Interactive code examples that render live in the browser:

````markdown
```jsx-live
const App = () => (
  <Button variant="solid">Click me</Button>
)
```
````

All Nimbus components are available globally without imports.

## File Organization

### Component Documentation

Component MDX files live with their components:

```
packages/nimbus/src/components/
└── button/
    ├── button.tsx
    ├── button.mdx        # Overview page (required)
    ├── button.guide.mdx  # Guidance for designers/UX (optional)
    ├── button.dev.mdx    # Developer documentation (optional)
    └── button.a11y.mdx   # Accessibility documentation (optional)
```

### Doc Site Components

Doc site-specific components live in the app:

```
apps/docs/src/components/
├── PropsTable.tsx      # Displays TypeScript props
├── CodeBlock.tsx       # Syntax highlighting
├── Navigation.tsx      # Site navigation
└── Search.tsx          # Search functionality
```

## Common Tasks

### Adding a New Component Documentation Page

1. Create `{component}.mdx` in component directory
2. Add required frontmatter (see [MDX Format](./mdx-format.md))
3. Write documentation with examples
4. Run build to generate routes: `pnpm --filter @commercetools/nimbus-docs-build build`
5. Dev server will hot-reload with new documentation

### Updating PropsTable

PropsTable automatically extracts props from TypeScript definitions. To update:

1. Modify component types in `{component}.types.ts`
2. Rebuild docs: `pnpm --filter @commercetools/nimbus-docs-build build`
3. Props will be extracted and displayed automatically

### Adding Interactive Examples

Use jsx-live blocks in MDX files:

````markdown
```jsx-live
const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Stack direction="column" gap="400">
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Stack>
  );
}
```
````

## Related Documentation

- **[Nimbus Component Guidelines](../nimbus/component-guidelines.md)** - Component development patterns
- **[Component Documentation Guidelines](../nimbus/file-type-guidelines/documentation.md)** - Writing MDX docs

## Common Issues

### PropsTable shows "Component not found"

- Ensure the component is exported from its main file
- Check that the `id` parameter matches the exact export name (case-sensitive)
- Rebuild: `pnpm --filter @commercetools/nimbus-docs-build build`

### jsx-live block not rendering

- Ensure the block starts with `const App = () => (`
- Check that all Nimbus components used are exported from `@commercetools/nimbus`
- Look for JavaScript errors in browser console

### Routes not updating

- Rebuild route manifest: `pnpm --filter @commercetools/nimbus-docs-build build`
- Restart dev server

### HMR not working

- Check that files are within `apps/docs/src/`
- Restart dev server
- Clear browser cache
