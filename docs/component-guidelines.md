# Nimbus Component Guidelines

This guide provides comprehensive guidelines for creating and maintaining
components in the Nimbus design system. It serves as the central hub for all
component-related documentation, patterns, and best practices.

## Quick Start

**Creating a new component?** Start with the
[Architecture Decision Guide](./file-type-guidelines/architecture-decisions.md)
to determine what type of component you're building.

**Updating an existing component?** Jump to the specific file type guidelines
below.

## Navigation by File Type

Each component can have various file types. Click on any file type below for
detailed guidelines:

### Core Component Files (Required)

- **[Barrel Exports (index.ts)](./file-type-guidelines/barrel-exports.md)** -
  Public API and module boundaries
- **[Main Component ({component}.tsx)](./file-type-guidelines/main-component.md)** -
  Component implementation patterns
- **[Type Definitions ({component}.types.ts)](./file-type-guidelines/types.md)** -
  TypeScript interfaces and props
- **[Stories ({component}.stories.tsx)](./file-type-guidelines/stories.md)** -
  Storybook stories and interaction tests
- **[Unit Tests ({component}.test.tsx)](./file-type-guidelines/unit-testing.md)** -
  Fast, isolated tests for component behavior
- **[Documentation ({component}.mdx)](./file-type-guidelines/documentation.md)** -
  Component documentation
- **[i18n ({component}.i18n.ts)](./file-type-guidelines/i18n.md)** -
  Internationalization and translations (when needed)

### Styling System Files (When Needed)

- **[Recipes ({component}.recipe.ts)](./file-type-guidelines/recipes.md)** -
  Chakra UI styling variants
- **[Slot Components ({component}.slots.tsx)](./file-type-guidelines/slots.md)** -
  Styled wrapper components

### Organizational Files (When Needed)

- **[Compound Components (components/)](./file-type-guidelines/compound-components.md)** -
  Multi-part component structure
- **[Hooks (hooks/)](./file-type-guidelines/hooks.md)** - Component-specific
  React hooks
- **[Utilities & Constants](./file-type-guidelines/utils-and-constants.md)** -
  Helper functions and constants

### Advanced Patterns (When Needed)

- **[Context Files](./file-type-guidelines/context-files.md)** - React context
  and providers
- **[Architecture Decisions](./file-type-guidelines/architecture-decisions.md)** -
  Decision matrix for component design

## Navigation by Task

### 🚀 Creating a New Component

1. **[Determine Architecture](./file-type-guidelines/architecture-decisions.md)** -
   Single vs compound, React Aria needs
2. **[Set Up Structure](./file-type-guidelines/main-component.md)** - Create
   main component file
3. **[Define Types](./file-type-guidelines/types.md)** - Create TypeScript
   interfaces
4. **[Add i18n](./file-type-guidelines/i18n.md)** - Set up translations if
   needed
5. **[Add Styling](./file-type-guidelines/recipes.md)** - Create recipes if
   needed
6. **[Create Slots](./file-type-guidelines/slots.md)** - Add slot components if
   needed
7. **[Write Stories](./file-type-guidelines/stories.md)** - Add Storybook
   stories with tests
8. **[Write Unit Tests](./file-type-guidelines/unit-testing.md)** - Add fast JSDOM-based tests
9. **[Document](./file-type-guidelines/documentation.md)** - Create MDX
   documentation
10. **[Export](./file-type-guidelines/barrel-exports.md)** - Set up public API

### 🎨 Adding Styling to Components

- **New visual styling needed?** →
  [Creating Recipes](./file-type-guidelines/recipes.md)
- **Multi-element styling?** →
  [Slot Components](./file-type-guidelines/slots.md)
- **Using existing components?** → No recipes needed, compose existing styled
  components

### ♿ Making Components Accessible

- **Need React Aria?** →
  [Architecture Decisions](./file-type-guidelines/architecture-decisions.md)
- **Need translatable labels?** → [i18n Files](./file-type-guidelines/i18n.md)
- **Complex interactions?** →
  [Context Files](./file-type-guidelines/context-files.md)
- **Keyboard navigation?** → [Hooks](./file-type-guidelines/hooks.md)

### 🧩 Building Complex Components

- **Multiple parts needed?** →
  [Compound Components](./file-type-guidelines/compound-components.md)
- **Shared state required?** →
  [Context Files](./file-type-guidelines/context-files.md)
- **Complex logic?** → [Hooks](./file-type-guidelines/hooks.md)

## Navigation by Component Complexity

### Simple Components

Components with single responsibility, no internal state management needed.

**Examples**: Button, Badge, Icon

**Typical files**:

- Main component file
- Types file
- Recipe (if custom styling)
- Stories
- Documentation

**Guidelines**: Start with
[Main Component](./file-type-guidelines/main-component.md)

### Compound Components

Components with multiple parts that work together, exposed as `Component.Root`,
`Component.Part`.

**Examples**: Menu, Select, Accordion

**Typical files**:

- Main component (exports only)
- Components folder with implementations
- Types file
- Slot recipes
- Stories with play functions
- Documentation

**Guidelines**: Start with
[Compound Components](./file-type-guidelines/compound-components.md)

### Complex Compositions

Components that compose multiple other components with complex state management.

**Examples**: DatePicker, RichTextInput, DataTable

**Typical files**:

- All of the above plus:
- Multiple hooks
- Utils and constants
- Context files
- Extended type definitions

**Guidelines**: Start with
[Architecture Decisions](./file-type-guidelines/architecture-decisions.md)

## Component File Structure Reference

```
component-name/
├── index.ts                       # Barrel exports (public API)
├── component-name.tsx             # Main component file
├── component-name.types.ts        # TypeScript interfaces
├── component-name.slots.tsx       # Slot components (if needed)
├── component-name.recipe.ts       # Styling recipes (if needed)
├── component-name.i18n.ts         # i18n messages (if needed)
├── component-name.stories.tsx     # Storybook stories (required)
├── component-name.mdx            # Documentation (required)
├── components/                    # Compound parts (if compound)
│   ├── component-name.root.tsx
│   ├── component-name.part.tsx
│   └── index.ts
├── hooks/                        # Component hooks (if needed)
│   ├── use-something.ts
│   └── index.ts
├── utils/                        # Utilities (if needed)
│   ├── helpers.ts
│   └── index.ts
└── constants/                    # Constants (if needed)
    └── index.ts
```

## Quick Reference

### Critical Rules

1. **Compound components include `.Root`** as the first property in the
   namespace object
2. **Hooks belong in `hooks/` folder** for organization
3. **Slot files export both components AND their TypeScript types**
4. **Interactive components include play functions** in stories
5. **Recipe registration is needed** in theme configuration

### Naming Conventions

| File Type     | Pattern                        | Example              |
| ------------- | ------------------------------ | -------------------- |
| Component     | `{component-name}.tsx`         | `button.tsx`         |
| Types         | `{component-name}.types.ts`    | `button.types.ts`    |
| Recipe        | `{component-name}.recipe.ts`   | `button.recipe.ts`   |
| Slots         | `{ComponentName}Slot`          | `ButtonSlot`         |
| Props         | `{ComponentName}Props`         | `ButtonProps`        |
| Hooks         | `use{Functionality}`           | `useButton`          |
| i18n          | `{component-name}.i18n.ts`     | `button.i18n.ts`     |
| Stories       | `{component-name}.stories.tsx` | `button.stories.tsx` |
| Documentation | `{component-name}.mdx`         | `button.mdx`         |

### Import Conventions

- **React Aria**: Use `Ra` prefix (e.g., `import { Button as RaButton }`)
- **Internal imports**: Use relative paths (`./hooks/use-button`)
- **Cross-component**: Use absolute alias (`@/components`)
- **Type imports**: Use `import { type X }` syntax

## Resources

### Templates

- **[Component Templates](./component-templates/)** - Ready-to-use boilerplate
  files

### Guides

- Use the file type guidelines above for updating existing components

### Tools & Commands

```bash
# Development
pnpm start:storybook    # Component development
pnpm start:docs         # Documentation site

# Quality checks
pnpm lint              # Linting
pnpm build:packages    # Build validation
pnpm test:storybook    # Story tests

# Component-specific
pnpm --filter @commercetools/nimbus build
pnpm --filter @commercetools/nimbus typecheck
```

## Getting Help

- Check the specific file type guidelines for detailed patterns
- Review existing components for examples
- Use the templates for quick starts
- Consult the migration guide for updates

---

Last updated: January 2025
