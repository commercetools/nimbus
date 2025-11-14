# Nimbus Monorepo Documentation

This directory contains detailed technical guidelines for developing in the Nimbus monorepo.

## RFC 2119 Compliance

**All documentation in this repository (CLAUDE.md files and .md/.mdx files) MUST be interpreted according to [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).**

Key words used:
- **MUST** / **REQUIRED** / **SHALL**: Absolute requirement
- **MUST NOT** / **SHALL NOT**: Absolute prohibition
- **SHOULD** / **RECOMMENDED**: May be ignored in particular circumstances with full understanding
- **SHOULD NOT** / **NOT RECOMMENDED**: May be acceptable in particular circumstances with full understanding
- **MAY** / **OPTIONAL**: Truly optional, discretionary

## Documentation by Package/App

### Component Development (Nimbus Package)

See [docs/nimbus/](./nimbus/) for comprehensive component development guidelines:

- Component architecture patterns and decision matrices
- File structure and naming conventions
- React Aria integration patterns
- Storybook development workflow (HMR vs built bundle modes)
- Testing strategies (stories vs unit tests)
- Type definitions and TypeScript architecture
- Styling with Chakra UI recipes and slots
- Internationalization (i18n) integration
- File review protocol

**Start here**: [Component Guidelines](./nimbus/component-guidelines.md)

### Documentation Site (Docs App)

See [docs/docs-app/](./docs-app/) for documentation site development:

- MDX documentation format and conventions
- Build system integration (`nimbus-docs-build`)
- PropsTable component usage
- Interactive code examples with `jsx-live`
- Route generation and search indexing

**Start here**: [Docs App Guidelines](./docs-app/readme.md)

### Design Tokens (Tokens Package)

Token system guidelines (to be added as needed).

## Quick Reference

### Root Documentation
- **[Root CLAUDE.md](../CLAUDE.md)** - Monorepo overview, workspace commands, build dependencies

### Package-Specific Quick Reference
- **[packages/nimbus/CLAUDE.md](../packages/nimbus/CLAUDE.md)** - Component library quick reference
- **[packages/tokens/CLAUDE.md](../packages/tokens/CLAUDE.md)** - Token system workflow
- **[packages/nimbus-icons/CLAUDE.md](../packages/nimbus-icons/CLAUDE.md)** - Icon generation
- **[packages/i18n/CLAUDE.md](../packages/i18n/CLAUDE.md)** - Internationalization workflow
- **[apps/docs/CLAUDE.md](../apps/docs/CLAUDE.md)** - Documentation site quick reference

## How to Use This Documentation

1. **Start with CLAUDE.md** - Quick reference in the package/app you're working on
2. **Deep dive in docs/** - Comprehensive guidelines organized by topic
3. **Follow the links** - Each CLAUDE.md points to relevant detailed documentation

## Structure

```
docs/
├── README.md           # This file - navigation hub
├── nimbus/            # Component development (32 files)
│   ├── readme.md
│   ├── component-guidelines.md
│   ├── file-review-protocol.md
│   ├── file-type-guidelines/
│   └── component-templates/
└── docs-app/          # Documentation site
    ├── readme.md
    ├── mdx-format.md
    ├── build-system.md
    └── props-table.md
```
