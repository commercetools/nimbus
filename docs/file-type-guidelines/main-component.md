# Main Component File Guidelines

[← Back to Index](../component-guidelines.md) | [Previous: Barrel Exports](./barrel-exports.md) | [Next: Types →](./types.md)

## Purpose

The main component file (`{component-name}.tsx`) serves as either the implementation home for simple components or the export facade for compound components. It defines how consumers interact with your component.

## When to Use

**Always required** - Every component needs a main file, but its role varies:

- **Single Component API**: Contains the actual implementation
- **Compound Component API**: Contains only exports, no implementation

## File Structure by Component Type

### Single Component Pattern

Implementation lives directly in the main file:

```typescript
// button.tsx - IMPLEMENTATION
import { useRef } from "react";
import { useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { Button as RaButton } from 'react-aria-components';
import { ButtonSlot } from './button.slots';
import type { ButtonProps } from './button.types';

export const Button = (props: ButtonProps) => {
  const { ref: forwardedRef, children, ...rest } = props;
  
  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLButtonElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <ButtonSlot asChild>
      <RaButton {...rest} ref={ref}>
        {children}
      </RaButton>
    </ButtonSlot>
  );
};

Button.displayName = 'Button';
```

### Compound Component Pattern (CRITICAL)

**MUST** follow this exact export pattern:

```typescript
// menu.tsx - EXPORTS ONLY, NO IMPLEMENTATION
import { MenuRoot } from "./components/menu.root";
import { MenuTrigger } from "./components/menu.trigger";
import { MenuItem } from "./components/menu.item";
// ... other imports

// Re-export types
export type * from "./menu.types";

/**
 * Menu
 * ============================================================
 * An accessible dropdown menu component
 *
 * @example
 * ```tsx
 * <Menu.Root>
 *   <Menu.Trigger>Open Menu</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item>Option 1</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */
export const Menu = {
  Root: MenuRoot,        // ⚠️ MUST BE FIRST - primary entry point
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  // ... other exports
};

// Internal exports for react-docgen
export {
  MenuRoot as _MenuRoot,
  MenuTrigger as _MenuTrigger,
  MenuItem as _MenuItem,
  // ... other internal exports
};
```

## Critical Rules

### 1. Compound Components MUST Have .Root

**This is non-negotiable** - All compound components must:
- Export a namespace object
- Have `.Root` as the FIRST property
- Root accepts all theme/variant props

```typescript
// ✅ CORRECT
export const Component = {
  Root: ComponentRoot,  // FIRST property
  Part: ComponentPart,
};

// ❌ WRONG - Missing Root
export const Component = {
  Trigger: ComponentTrigger,
  Content: ComponentContent,
};

// ❌ WRONG - Root not first
export const Component = {
  Trigger: ComponentTrigger,
  Root: ComponentRoot,  // Should be first
};
```

### 2. Implementation Location

- **Single components**: Implementation in main file OR components/ folder
- **Compound components**: Implementation ALWAYS in components/ folder

```typescript
// ✅ Single component - implementation in main file
// button.tsx
export const Button = (props) => { /* implementation */ };

// ✅ Compound component - no implementation in main file
// menu.tsx
export const Menu = {
  Root: MenuRoot,  // Imported from ./components/menu.root.tsx
};
```

### 3. DisplayName Convention

Always set displayName for debugging:

```typescript
// Single component
Button.displayName = 'Button';

// Compound component parts (in components/ files)
MenuRoot.displayName = 'Menu.Root';
MenuTrigger.displayName = 'Menu.Trigger';
```

## Examples from Nimbus

### Simple Component (Badge)

```typescript
// badge.tsx
import type { BadgeProps } from './badge.types';
import { BadgeSlot } from './badge.slots';

export const Badge = (props: BadgeProps) => {
  const { children, ...restProps } = props;
  
  return (
    <BadgeSlot {...restProps}>
      {children}
    </BadgeSlot>
  );
};

Badge.displayName = 'Badge';
```

### Compound Component (Select)

```typescript
// select.tsx - EXPORTS ONLY
import { SelectRoot } from './components/select-root';
import { SelectTrigger } from './components/select-trigger';
import { SelectOption } from './components/select-option';

export type * from './select.types';

/**
 * Select
 * ============================================================
 * Dropdown selection component with accessibility
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
};

// For react-docgen
export {
  SelectRoot as _SelectRoot,
  SelectTrigger as _SelectTrigger,
};
```

## React Aria Integration

### Import Convention

Always use `Ra` prefix for React Aria components:

```typescript
import { Button as RaButton } from 'react-aria-components';
import { Select as RaSelect } from 'react-aria-components';
```

### Integration Pattern

```typescript
// With slot wrapper for styling
export const Button = (props: ButtonProps) => {
  const { ref: forwardedRef, children, ...rest } = props;
  
  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLButtonElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <ButtonSlot asChild>
      <RaButton {...rest} ref={ref}>
        {children}
      </RaButton>
    </ButtonSlot>
  );
};
```

## Documentation Requirements

### JSDoc Comments

Include comprehensive JSDoc for the main export:

```typescript
/**
 * ComponentName
 * ============================================================
 * Brief description of what the component does
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 * 
 * @see https://react-spectrum.adobe.com/react-aria/ComponentName.html
 */
export const ComponentName = {
  // ...
};
```

## Common Mistakes

### 1. Implementation in Compound Component Main File

```typescript
// ❌ Bad - implementation in main file for compound component
// menu.tsx
export const Menu = {
  Root: (props) => { /* implementation here */ },  // Wrong!
};

// ✅ Good - import from components folder
// menu.tsx
import { MenuRoot } from './components/menu.root';
export const Menu = {
  Root: MenuRoot,
};
```

### 2. Wrong Property Order

```typescript
// ❌ Bad - Root not first
export const Menu = {
  Trigger: MenuTrigger,
  Root: MenuRoot,  // Should be first!
  Content: MenuContent,
};

// ✅ Good - Root first
export const Menu = {
  Root: MenuRoot,     // First property
  Trigger: MenuTrigger,
  Content: MenuContent,
};
```

### 3. Missing Internal Exports

```typescript
// ❌ Bad - no internal exports for react-docgen
export const Menu = {
  Root: MenuRoot,
};

// ✅ Good - includes internal exports
export const Menu = {
  Root: MenuRoot,
};

export {
  MenuRoot as _MenuRoot,  // For react-docgen
};
```

### 4. Inconsistent React Aria Naming

```typescript
// ❌ Bad - no prefix, confusing
import { Button } from 'react-aria-components';

// ✅ Good - Ra prefix
import { Button as RaButton } from 'react-aria-components';
```

## Related Guidelines

- [Compound Components](./compound-components.md) - Detailed compound patterns
- [Types](./types.md) - Props interface patterns
- [Slots](./slots.md) - Slot wrapper integration
- [Architecture Decisions](./architecture-decisions.md) - When to use compound

## Validation Checklist

- [ ] Main component file exists
- [ ] For compound: exports only, no implementation
- [ ] For compound: `.Root` is FIRST property
- [ ] For single: implementation present
- [ ] DisplayName set for all exported components
- [ ] React Aria imports use `Ra` prefix
- [ ] JSDoc documentation included
- [ ] Internal exports for react-docgen (compound)
- [ ] Types re-exported appropriately

---

[← Back to Index](../component-guidelines.md) | [Previous: Barrel Exports](./barrel-exports.md) | [Next: Types →](./types.md)