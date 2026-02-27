# Component Templates

This directory contains ready-to-use boilerplate templates for creating new
Nimbus components. Copy and customize these templates to quickly start new
components with the correct structure.

[← Back to Component Guidelines](../component-guidelines.md)

## Available Templates

### Basic Components

#### Single Component

Simple component with single responsibility, no compound parts.

**Files:**

- [single-component.md](./single-component.md) - Main component
- [single-component.types.md](./single-component.types.md) - Types
- [single-component.recipe.md](./single-component.recipe.md) - Recipe
- [single-component.slots.md](./single-component.slots.md) - Slots
- [single-component.stories.md](./single-component.stories.md) - Stories

### Compound Components

#### Compound Component with Root

Component with multiple coordinated parts.

**Files:**

- [compound-component.md](./compound-component.md) - Main exports
- [compound-component.root.md](./compound-component.root.md) - Root
  implementation
- [compound-component.types.md](./compound-component.types.md) - All types
- [compound-component.recipe.md](./compound-component.recipe.md) - Slot recipe
- [compound-component.slots.md](./compound-component.slots.md) - Slot components
- [compound-component.stories.md](./compound-component.stories.md) - Stories

### Supporting Files

#### Internationalization

- [i18n.template.md](./i18n.template.md) - i18n messages template

> **Note**: Hooks, context, utils, and constants templates are not yet available
> but can be modeled after existing component implementations.

## Usage Instructions

### Quick Start

1. **Choose the appropriate template** based on your component type
2. **Copy the template files** to your new component directory
3. **Find and replace** the following placeholders:
   - `ComponentName` → Your component name (PascalCase)
   - `component-name` → Your component name (kebab-case)
   - `componentName` → Your component name (camelCase)
   - `COMPONENT_NAME` → Your component name (CONSTANT_CASE)

### Example: Creating a "Tooltip" Component

1. Create directory: `packages/nimbus/src/components/tooltip/`
2. Copy single component templates
3. Replace:
   - `ComponentName` → `Tooltip`
   - `component-name` → `tooltip`
   - `componentName` → `tooltip`
   - Update descriptions and documentation

### Template Placeholders

| Placeholder      | Usage                          | Example                  |
| ---------------- | ------------------------------ | ------------------------ |
| `ComponentName`  | Component class/function names | `ButtonGroup`            |
| `component-name` | File names, CSS classes        | `button-group`           |
| `componentName`  | Variable names, props          | `buttonGroup`            |
| `COMPONENT_NAME` | Constants                      | `BUTTON_GROUP`           |
| `{DESCRIPTION}`  | Component description          | "Groups related buttons" |
| `{CATEGORY}`     | Menu category                  | "Actions"                |

## Template Patterns

### Single Component Pattern

Best for:

- Buttons, Badges, Icons
- Simple display components
- Single responsibility components

Structure:

```
tooltip/
├── tooltip.tsx              # Implementation
├── tooltip.types.ts         # Props interface
├── tooltip.i18n.ts         # Translations (if needed)
├── tooltip.recipe.ts        # Styling
├── tooltip.slots.tsx        # Slot component
├── tooltip.stories.tsx      # Stories
├── tooltip.mdx             # Docs
└── index.ts                # Export
```

### Compound Component Pattern

Best for:

- Menus, Selects, Accordions
- Multi-part interactive components
- Flexible composition needed

Structure:

```
menu/
├── menu.tsx                # Exports only
├── components/
│   ├── menu.root.tsx
│   ├── menu.trigger.tsx
│   └── menu.item.tsx
├── menu.types.ts
├── menu.i18n.ts           # Translations (if needed)
├── menu.recipe.tsx
├── menu.slots.tsx
├── menu.stories.tsx
├── menu.mdx
└── index.ts
```

### Complex Component Pattern

Best for:

- Date Pickers, Data Tables
- Components with significant logic
- Multiple hooks and utilities

Additional structure:

```
date-picker/
├── ... (compound structure)
├── hooks/
│   └── use-date-picker.ts
├── utils/
│   └── date-helpers.ts
├── constants/
│   └── calendar-config.ts
└── date-picker-context.tsx
```

## Customization Guide

### Adding React Aria

```typescript
// Import with Ra prefix
import { Button as RaButton } from 'react-aria-components';

// Wrap with slot
export const ComponentName = (props: ComponentNameProps) => {
  return (
    <ComponentNameSlot asChild>
      <RaButton {...props}>
        {props.children}
      </RaButton>
    </ComponentNameSlot>
  );
};
```

### Adding Variants

```typescript
// In recipe file
variants: {
  variant: {
    primary: { /* styles */ },
    secondary: { /* styles */ },
  },
  size: {
    sm: { /* styles */ },
    md: { /* styles */ },
    lg: { /* styles */ },
  },
}
```

### Adding State Management

```typescript
// For simple state
const [isOpen, setIsOpen] = useState(false);

// For complex state, create a hook
export function useComponentName(options) {
  // State and logic
  return {
    /* public API */
  };
}

// For shared state, use context
const ComponentContext = createContext();
```

## Validation

After creating a component from templates:

1. **Run type checking**: `pnpm typecheck`
2. **Run linting**: `pnpm lint`
3. **Build packages**: `pnpm build:packages`
4. **Test stories**: `pnpm test:storybook`
5. **Check recipe registration** in theme configuration

## Common Modifications

### Remove Recipe/Slots

If composing existing styled components:

1. Delete `*.recipe.ts` and `*.slots.tsx`
2. Remove recipe imports
3. Use existing Nimbus components directly

### Add Context

For state sharing between parts:

1. Copy `component-context.template.tsx`
2. Define context value interface
3. Wrap root component with provider

### Add Hooks

For complex logic:

1. Create `hooks/` directory
2. Copy `use-component.template.ts`
3. Implement logic
4. Export from `hooks/index.ts`

## Tips

- Start with the simplest template that fits
- Add complexity only as needed
- Follow existing patterns in the codebase
- Check similar components for examples
- Don't forget recipe registration!
- Always include comprehensive JSDoc

---

For detailed guidelines on each file type, see the
[File Type Guidelines](../file-type-guidelines/).
