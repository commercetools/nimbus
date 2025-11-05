---
"@commercetools/nimbus": patch
---

Fix cross-chunk circular dependencies by importing directly from implementation files

Previously, components importing from other components' barrel exports (index.ts) created circular chunk dependencies during the build process. This has been fixed by updating all cross-component imports to import directly from implementation files (e.g., `button.tsx`, `button.types.ts`) instead of barrel exports.

Changes:
- Updated 29 cross-component imports across 15 files in components and patterns directories
- Added comprehensive documentation about the cross-chunk import pattern in docs/component-guidelines.md and docs/file-type-guidelines/main-component.md
- Clarified vite.config.ts warning suppression to specifically target intentional compound component barrel export patterns
- Added inline documentation in vite.config.ts explaining the relationship between build configuration and import requirements

This change prevents potential circular dependency warnings, ensures predictable module initialization order, and maintains optimal code splitting behavior.
