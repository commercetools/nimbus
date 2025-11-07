# @commercetools/nimbus-docs-build

Documentation build system for the Nimbus design system. This package handles:

- **MDX Parsing**: Extracts frontmatter, generates table of contents, supports multi-view documentation
- **TypeScript Type Extraction**: Parses component props using react-docgen-typescript
- **Route Generation**: Creates route manifests for documentation navigation
- **Search Index**: Generates searchable documentation index
- **Build Caching**: Incremental builds with file hashing
- **Content Validation**: Validates documentation structure and content
- **Asset Optimization**: Optimizes images and static assets
- **SEO Generation**: Creates robots.txt and sitemap.xml

## Installation

```bash
pnpm add -D @commercetools/nimbus-docs-build
```

## Usage

### Configuration

Create a `docs-build.config.ts` file:

```typescript
import { defineConfig } from '@commercetools/nimbus-docs-build';

export default defineConfig({
  sources: {
    packagesDir: './packages',
    componentIndexPath: './packages/nimbus/src/index.ts',
  },
  output: {
    routesDir: './src/data/routes',
    manifestPath: './src/data/route-manifest.json',
    searchIndexPath: './src/data/search-index.json',
    typesDir: './public/generated/types',
  },
  cache: {
    enabled: true,
  },
  seo: {
    baseUrl: 'https://nimbus.commercetools.com',
    generateRobots: true,
    generateSitemap: true,
  },
});
```

### Programmatic API

```typescript
import { build } from '@commercetools/nimbus-docs-build';

const result = await build({
  sources: {
    packagesDir: './packages',
  },
  output: {
    routesDir: './dist/routes',
    manifestPath: './dist/manifest.json',
    searchIndexPath: './dist/search.json',
    typesDir: './dist/types',
  },
});

console.log(`Built ${result.routeCount} routes`);
```

### Individual Builders

```typescript
import {
  parseMdx,
  parseTypes,
  generateRouteManifest,
} from '@commercetools/nimbus-docs-build';

// Parse a single MDX file
const doc = await parseMdx('./path/to/file.mdx');

// Extract TypeScript types
await parseTypes({
  componentIndexPath: './src/index.ts',
  outputPath: './dist/types.json',
});

// Generate route manifest
await generateRouteManifest(docs, './dist/manifest.json');
```

## Features

### Multi-View Documentation

Supports multiple views for a single documentation page:

- `button.mdx` - Main documentation (overview)
- `button.dev.mdx` - Developer-specific view
- `button.api.mdx` - API reference view

### Incremental Builds

Uses file hashing to skip unchanged files, dramatically improving build times.

### Content Validation

Validates:
- Required frontmatter fields
- Menu structure
- Content presence
- Internal links

### TypeScript Type Extraction

Automatically extracts and filters component props:
- Filters out HTML attributes
- Filters out Chakra system props
- Filters out React internals
- Enriches with JSDoc metadata

## Configuration Options

See TypeScript definitions for complete configuration options.

## License

MIT
