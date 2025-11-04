# Data

This folder houses automatically generated JSON files for the documentation site.

## Generated Files

- **`route-manifest.json`** - Routes manifest mapping component names to their MDX documentation files
- **`search-index.json`** - Search index for the documentation site search functionality
- **`types/`** - TypeScript type definitions extracted from components
  - `manifest.json` - Types manifest mapping component names to their type definition files
  - `{ComponentName}.json` - Individual component type definition files (e.g., `Button.json`, `Menu.json`)

All files are automatically generated during development when files change, or before a build.
They are dynamically imported at runtime for optimal code-splitting.
