# Utilities and Constants Guidelines

[← Back to Index](../component-guidelines.md) | [Previous: Hooks](./hooks.md) |
[Next: Context Files →](./context-files.md)

## Purpose

The `utils/` and `constants/` directories contain helper functions, utilities,
configuration constants, and enums specific to a component. They help organize
non-React logic and static values.

## When to Use

### Create Utils When:

- **Pure functions** are needed (no React features)
- **Data transformation** or formatting logic
- **Validation** or parsing functions
- **Complex calculations** that don't need React
- **Helper functions** used multiple times

### Create Constants When:

- **Configuration values** need central management
- **Enums** or string literals are repeated
- **Default values** for complex structures
- **Keyboard shortcuts** or key codes
- **Regex patterns** for validation

### When Utils/Constants Aren't Needed:

- Logic requires React features (use hooks instead)
- Values are used only once
- Simple constants (keep in component file)

## Directory Structure

```
component-name/
├── component-name.tsx
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── helpers.ts
│   └── index.ts
├── constants/
│   ├── defaults.ts
│   ├── enums.ts
│   ├── config.ts
│   └── index.ts
└── index.ts
```

## Utils Patterns

### Pure Helper Functions

- Date formatting and localization functions
- String manipulation utilities (truncation, sanitization)
- Mathematical calculations and conversions
- Data validation and parsing functions
- Array and object transformation utilities

### Utils Index File

Export all utility functions from a centralized index file for clean imports.

## Constants Patterns

### Configuration Constants

- Pagination settings and defaults
- Date picker configuration values
- Form validation rules and limits

### Constant Values and Lookup Tables

Constants should contain **values**, not type definitions. Type definitions
belong in the types file.

**Constants Examples:**

- Keyboard key constants (`ENTER_KEY = 'Enter'`, `ESCAPE_KEY = 'Escape'`)
- Validation limits (`MAX_FILE_SIZE = 5000000`, `MIN_PASSWORD_LENGTH = 8`)
- HTTP status codes or error codes
- Lookup tables for data transformation
- Arrays of valid options (when needed for validation/iteration)

**Note:** Component variants (size, visual style) are defined in:

- **Recipe files** for styling variants
- **Types files** for type definitions like `type Size = 'sm' | 'md' | 'lg'`
- **Not in constants** unless you need an array of valid values for
  validation/iteration purposes

### Default Values

- Default option arrays for select components
- Default table column configurations
- Default color palettes for theming

### Regex Patterns

- Common validation patterns (email, URL, phone numbers)
- Input format validators
- Credit card number patterns

### Constants Index File

Export all constants from a centralized index file for clean imports.

## TypeScript Best Practices

### Type-Safe Constants

Use `as const` assertions to ensure immutable, type-safe constant definitions.

### Pure Function Types

Provide explicit TypeScript types for all utility functions with proper
parameter and return type definitions.

## Related Guidelines

- [Hooks](./hooks.md) - React-specific logic
- [Types](./types.md) - Type definitions
- [Main Component](./main-component.md) - Using utils in components

## Validation Checklist

- [ ] Utils in `utils/` subfolder
- [ ] Constants in `constants/` subfolder
- [ ] Pure functions (no React features in utils)
- [ ] Immutable constants with `as const`
- [ ] JSDoc documentation for all exports
- [ ] Type-safe function signatures
- [ ] No side effects in utils
- [ ] Index files export all items
- [ ] Tests for complex utilities
- [ ] Meaningful, descriptive names

---

[← Back to Index](../component-guidelines.md) | [Previous: Hooks](./hooks.md) |
[Next: Context Files →](./context-files.md)
