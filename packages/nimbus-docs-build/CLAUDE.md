# Nimbus Documentation Build System

## Package Overview

The `@commercetools/nimbus-docs-build` package provides build-time tooling for documentation generation:
- TypeScript type extraction from component files using react-docgen-typescript
- MDX parsing and processing with remark
- Documentation data generation for consumption by the docs site
- Frontmatter parsing with gray-matter
- Table of contents generation with remark-flexible-toc

This is a **build-time tooling package** consumed by `apps/docs` during its build process.

## Build Process

### Build Commands

```bash
# Build from root
pnpm --filter @commercetools/nimbus-docs-build build

# Or in watch mode for development
pnpm --filter @commercetools/nimbus-docs-build dev

# Type check
pnpm --filter @commercetools/nimbus-docs-build typecheck
```

### What This Package Does

This package provides utilities for the docs site build process:

1. **TypeScript Type Extraction**
   - Extracts prop types and interfaces from component files
   - Generates documentation data for props tables
   - Uses react-docgen-typescript parser

2. **MDX Processing**
   - Parses MDX documentation files
   - Extracts frontmatter metadata (title, description, category)
   - Generates table of contents from headings
   - Processes code blocks and live examples

3. **Documentation Data Generation**
   - Combines type data with MDX content
   - Generates structured JSON for docs site consumption
   - Creates search indexes

## How It's Used

### In apps/docs Build Scripts

The docs site imports and uses this package in its build scripts:

```typescript
// apps/docs/scripts/build.ts
import { extractComponentDocs, parseMdxFile } from '@commercetools/nimbus-docs-build'

// Extract component documentation
const docs = await extractComponentDocs({
  componentPath: '/path/to/components',
  outputPath: '/path/to/output'
})

// Parse MDX files
const mdxData = await parseMdxFile('/path/to/component.mdx')
```

### Type Extraction Example

```typescript
// This package extracts types like:
interface ButtonProps {
  /**
   * The button variant style
   * @default "secondary"
   */
  variant?: 'primary' | 'secondary' | 'danger'

  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg'
}

// Into structured documentation data:
{
  "props": {
    "variant": {
      "type": "'primary' | 'secondary' | 'danger'",
      "defaultValue": "secondary",
      "description": "The button variant style",
      "required": false
    },
    "size": {
      "type": "'sm' | 'md' | 'lg'",
      "description": "Button size",
      "required": false
    }
  }
}
```

## Package Structure

### Key Files

```
packages/nimbus-docs-build/
├── src/
│   ├── extract-types.ts     # TypeScript prop extraction logic
│   ├── parse-mdx.ts         # MDX parsing and processing
│   ├── generate-docs.ts     # Main docs generation orchestration
│   └── index.ts             # Public API exports
├── dist/                    # Compiled output (generated)
│   ├── index.js
│   └── index.d.ts
└── package.json
```

### Public API

```typescript
// Main exports from this package
export function extractComponentDocs(options: ExtractOptions): Promise<ComponentDoc[]>
export function parseMdxFile(filePath: string): Promise<MdxData>
export function generateTableOfContents(mdxContent: string): TocItem[]
```

## Development

### Making Changes

1. Edit source files in `src/`
2. Build the package:
   ```bash
   pnpm --filter @commercetools/nimbus-docs-build build
   ```
3. Test in docs site:
   ```bash
   pnpm --filter docs build:docs
   ```

### Testing Locally

```bash
# Watch mode for development
pnpm --filter @commercetools/nimbus-docs-build dev

# In another terminal, run docs build to test
pnpm --filter docs build:docs
```

## Dependencies

### Key Dependencies

- **react-docgen-typescript** - Extracts TypeScript types and JSDoc comments
- **remark** - MDX/Markdown parsing and transformation
- **remark-flexible-toc** - Table of contents generation
- **gray-matter** - Frontmatter parsing (YAML/TOML in MDX)
- **@typescript-eslint/typescript-estree** - TypeScript AST parsing
- **zod** - Schema validation for documentation data

### Package Dependencies

This package:
- Does not depend on other nimbus packages
- Can build independently
- Is consumed as a devDependency by `apps/docs`

## Common Tasks

### Update Type Extraction Logic

Edit `src/extract-types.ts`:

```typescript
// Customize how props are extracted
export function extractComponentTypes(filePath: string) {
  // Custom extraction logic
}
```

### Customize MDX Processing

Edit `src/parse-mdx.ts`:

```typescript
// Add custom remark plugins
export function parseMdx(content: string) {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkToc)
    // Add more plugins here
}
```

### Add New Frontmatter Fields

Update the schema and parser to handle new frontmatter fields:

```typescript
// In src/parse-mdx.ts
const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  newField: z.string().optional() // Add new field
})
```

## Troubleshooting

### Type Extraction Failing

If component types aren't being extracted:

1. Check component has proper TypeScript interface
2. Verify JSDoc comments are formatted correctly
3. Ensure component is exported properly
4. Check TypeScript compilation succeeds

### MDX Parsing Errors

If MDX files fail to parse:

1. Validate MDX syntax (check for unclosed tags)
2. Verify frontmatter is valid YAML
3. Check for special characters that need escaping
4. Test MDX in isolation with remark parser

### Build Performance

If builds are slow:

1. Enable caching in react-docgen-typescript
2. Process only changed files (incremental builds)
3. Parallelize type extraction across multiple files
4. Consider memoizing parsed MDX content

## Integration with Docs Site

The docs site uses this package in its build pipeline:

```
1. apps/docs runs build:docs script
2. Script imports extractComponentDocs from this package
3. Extracts types from all components in packages/nimbus
4. Parses all .mdx files for documentation content
5. Generates JSON data files
6. Docs site build:app step consumes the JSON data
```

## Future Enhancements

Potential improvements for this package:

- Incremental builds (only process changed files)
- Parallel processing for better performance
- Source map generation for debugging
- Plugin system for custom extractors
- Caching layer for faster rebuilds
