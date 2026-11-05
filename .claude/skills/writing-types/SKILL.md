---
description: Create, update, or validate TypeScript type definitions for components
argument-hint: create|update|validate ComponentName [details]
---

# Writing Types Skill

You are a Nimbus TypeScript types specialist. This skill helps you create,
update, or validate type definition files (`{component}.types.ts`) that define
the public API contract for components with proper TypeScript interfaces and
type safety.

## Critical Requirements

**Type files are the public API contract.** Every component MUST have
comprehensive TypeScript types that define props interfaces, recipe variants,
and ensure type safety for consumers.

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new type definitions file
- **update** - Add new types, enhance interfaces, update props
- **validate** - Check type definitions compliance with guidelines

If no mode is specified, default to **create**.

## Required Research (All Modes)

Before implementation, you MUST research in parallel:

1. **Read** JSDoc standards:

   ```bash
   cat docs/jsdoc-standards.md
   ```

2. **Read** naming conventions:

   ```bash
   cat docs/naming-conventions.md
   ```

3. **Read** type definition guidelines:

   ```bash
   cat docs/file-type-guidelines/types.md
   ```

4. **Analyze** similar component types:

   ```bash
   # Find similar components
   ls packages/nimbus/src/components/*/*.types.ts

   # Read reference implementations
   cat packages/nimbus/src/components/button/button.types.ts  # Simple
   cat packages/nimbus/src/components/menu/menu.types.ts      # Compound
   ```

5. **Check** component complexity tier:
   - See docs/file-type-guidelines/types.md for tier decision flow
   - Tier 1: Simple (Button, Badge)
   - Tier 2: Slot-based (TextInput, NumberInput)
   - Tier 3: Compound (Menu, Dialog)
   - Tier 4: Complex (DataTable, DatePicker)

6. **Review** recipe and slot files if they exist:
   ```bash
   cat packages/nimbus/src/components/{component}/{component}.recipe.ts
   cat packages/nimbus/src/components/{component}/{component}.slots.tsx
   ```

## The Universal Four-Layer Pattern (CRITICAL)

Every Nimbus component type follows this layered architecture:

```typescript
// Layer 1: Recipe Props (Styling Variants)
type ComponentRecipeProps = {
  size?: RecipeProps<"component">["size"];
  variant?: RecipeProps<"component">["variant"];
} & UnstyledProp;

// Layer 2: Slot Props (Chakra Foundation)
type ComponentRootSlotProps = HTMLChakraProps<"element", ComponentRecipeProps>;

// Layer 3: Helper Types (when needed - for complex components)
type ConflictingProps = keyof AriaProps;
type ExcludedProps = "css" | "colorScheme";

// Layer 4: Main Props (Public API)
export type ComponentProps = Omit<
  ComponentRootSlotProps,
  ConflictingProps | ExcludedProps
> &
  AriaProps & {
    ref?: React.Ref<HTMLElement>;
    customProp?: string;
  };
```

**Key Principle:** Slot props are ALWAYS the foundation. Never build props from
scratch.

## Component Tier Decision Matrix

Choose the tier using the decision flow in `reference/component-tiers.md`. List its tier headings with `rg -n '^###' .claude/skills/writing-types/reference/component-tiers.md`.

## File Structure Requirements

### Standard Section Organization

Every types file MUST follow this order:

```typescript
// Start directly with imports (no file-level JSDoc preamble)
import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================
// Styling variants (size, variant, colorPalette, etc.)
// Only present when component has custom styling recipes

// ============================================================
// SLOT PROPS
// ============================================================
// Chakra HTML props for each visual element in the component
// Root slot props always present, additional slots for multi-element components

// ============================================================
// HELPER TYPES (when needed)
// ============================================================
// Explicit documentation of props that conflict between libraries
// Utility types, generic constraints, context values
// Only present in Tier 3/4 components

// ============================================================
// MAIN PROPS
// ============================================================
// Public API with comprehensive JSDoc on every property
// Sub-component props for compound components
```

### React Aria Import Convention (CRITICAL)

**ALWAYS** prefix React Aria imports with "Ra":

```typescript
// ✅ CORRECT
import { Button as RaButton } from "react-aria-components";
import { MenuProps as RaMenuProps } from "react-aria-components";
import { TextFieldProps as RaTextFieldProps } from "react-aria-components";

// ❌ INCORRECT
import { Button } from "react-aria-components";
import { MenuProps } from "react-aria-components";
```

## Type Visibility Rules

### Public API Types (in {component}.types.ts)

Types that component **consumers** need to import:

```typescript
// ✅ These belong in component.types.ts
export type ComponentNameProps = {
  /* ... */
};
export type UseComponentNameOptions = {
  /* ... */
};
export type ComponentVariant = "solid" | "outline" | "ghost";
```

**Characteristics:**

- Imported by component consumers
- Referenced in documentation
- Part of external contract
- Changes require semver consideration

### Internal Implementation Types (colocated)

Types used only within component implementation:

```typescript
// ✅ In utils/sanitize-svg.ts
type SanitizationOptions = {
  /* ... */
};

// ✅ In hooks/use-internal-state.ts
type InternalHookState = {
  /* ... */
};
```

**Characteristics:**

- Never imported by consumers
- Implementation details
- Can change without affecting users
- Colocated with usage for maintainability

## Recipe Variant Props Integration

**Recipe variants are automatically inherited through slot props:**

```typescript
// ✅ CORRECT - Extends slot props (automatically includes recipe variants)
export type ButtonProps = ButtonSlotProps & {
  // Component-specific props only
  isLoading?: boolean;
};

// ❌ INCORRECT - Don't redeclare recipe variants
export type ButtonProps = ButtonSlotProps & {
  size?: "sm" | "md" | "lg"; // Already in ButtonSlotProps!
  variant?: "solid" | "outline"; // Already in ButtonSlotProps!
};
```

**Exception - Functional Overlap:**

When a property affects both styling AND behavior:

```typescript
export type TabsProps = TabsSlotProps & {
  /**
   * Tab orientation - affects both layout AND keyboard navigation
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
};
```

## Generic Components

### When to Use Generics

For components that work with different data types:

```typescript
// For components that handle collections
export type SelectProps<T = string> = {
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
};

export type SelectOption<T = string> = {
  label: string;
  value: T;
  isDisabled?: boolean;
};
```

### Generic Constraints

```typescript
// With constraints
export type DataTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: ColumnDef<T>[];
};

// With default type
export type ListProps<T = unknown> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};
```

## Event Handler Types

### Standard Events

```typescript
import { type MouseEvent, type KeyboardEvent } from "react";

export type InteractiveProps = {
  /**
   * Callback when element is clicked
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for keyboard events
   */
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
};
```

### Custom Events

```typescript
export type CustomComponentProps = {
  /**
   * Called when selection changes
   */
  onSelectionChange?: (selectedKeys: Set<string>) => void;

  /**
   * Called when value is committed
   */
  onCommit?: (value: string) => void;
};
```

## Create Mode

### Step 1: Determine Component Tier

Analyze component to determine tier:

- Tier 1: Simple, single element
- Tier 2: Multiple slots, form components
- Tier 3: Compound with multiple parts
- Tier 4: Complex with generics and helpers

### Step 2: Create File Structure

Start with imports:

```typescript
import type {
  HTMLChakraProps,
  RecipeProps, // or SlotRecipeProps for multi-slot
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// For React Aria integration:
import type { ButtonProps as RaButtonProps } from "react-aria-components";
```

### Step 3: Define Recipe Props

If component has custom styling:

```typescript
type ComponentRecipeProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: RecipeProps<"component">["size"];
  /**
   * Visual style variant
   * @default "solid"
   */
  variant?: RecipeProps<"component">["variant"];
} & UnstyledProp;
```

### Step 4: Define Slot Props

For each visual element:

```typescript
export type ComponentRootSlotProps = HTMLChakraProps<
  "div",
  ComponentRecipeProps
>;
export type ComponentPartSlotProps = HTMLChakraProps<"span">;
```

### Step 5: Define Helper Types

For Tier 3/4 components with conflicts:

```typescript
type ConflictingProps = keyof SomeAriaProps;
type ExcludedProps = "css" | "colorScheme";
```

### Step 6: Define Main Props

Public API with JSDoc:

```typescript
export type ComponentProps = ComponentRootSlotProps & {
  /**
   * Component-specific prop with description
   * @default "default"
   */
  customProp?: string;

  /**
   * Reference to the element
   */
  ref?: React.Ref<HTMLElement>;
};
```

### Step 7: Define Sub-Component Props

For compound components:

```typescript
/**
 * Props for the Component.Part.
 */
export type ComponentPartProps = ComponentPartSlotProps & {
  /**
   * Part-specific prop
   */
  partProp?: string;
};
```

## Update Mode

### Process

1. You MUST read existing type definitions
2. You MUST maintain type hierarchy
3. You SHOULD preserve existing structure
4. You MUST add JSDoc to new properties
5. You MUST update related files if needed

### Common Updates

- **Add new prop** - Add to appropriate layer with JSDoc
- **Add variant** - Usually auto-inherited from recipe
- **Add sub-component** - Create new props type
- **Add generic** - Add type parameter and constraints
- **Deprecate prop** - Add @deprecated tag

## Validate Mode

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Types file exists with `.ts` extension
- [ ] Section dividers in correct order (Recipe → Slot → Helper → Main)
- [ ] Only consumer-facing types in file
- [ ] Internal types colocated with usage

#### Naming Conventions

- [ ] All naming follows conventions table
- [ ] Props follow `{ComponentName}Props` pattern
- [ ] React Aria imports use "Ra" prefix
- [ ] Recipe props: `{Component}RecipeProps`
- [ ] Slot props: `{Component}RootSlotProps`, `{Component}{Part}SlotProps`

#### Type Construction

- [ ] Uses `type` syntax (not `interface`)
- [ ] Extends appropriate slot props
- [ ] Recipe variants automatically inherited (not explicit)
- [ ] Conflicts explicitly documented in Helper Types
- [ ] Four-layer pattern followed

#### Documentation

- [ ] JSDoc comments for all properties
- [ ] Default values documented with `@default`
- [ ] Complex props have `@example` tags
- [ ] Event handlers properly typed
- [ ] No file-level JSDoc preamble

#### Type Safety

- [ ] Generic types used appropriately
- [ ] No inline complex types
- [ ] No implementation details leaked
- [ ] Ref forwarding included in public props

### Validation Report Format

```markdown
## Type Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Component Tier: [1 | 2 | 3 | 4]

### Files Reviewed

- Types file: `{component}.types.ts`
- Slots file: `{component}.slots.tsx`
- Recipe file: `{component}.recipe.ts`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Type Structure Assessment

- Layer organization: [Correct | Incorrect]
- Naming conventions: [Followed | Violations found]
- JSDoc coverage: [Complete | Partial | Missing]
- Recipe integration: [Automatic | Explicit (wrong)]

### Recommendations

- [Specific improvements needed]
```

## Error Recovery

If validation fails:

1. You MUST check naming conventions
2. You MUST verify layer order
3. You MUST ensure slot props are base
4. You MUST confirm JSDoc on all properties
5. You SHOULD check recipe variant inheritance

## Reference Examples

You SHOULD reference these type files:

- **Tier 1**: `packages/nimbus/src/components/button/button.types.ts`
- **Tier 2**: `packages/nimbus/src/components/text-input/text-input.types.ts`
- **Tier 3**: `packages/nimbus/src/components/menu/menu.types.ts`
- **Tier 4**: `packages/nimbus/src/components/data-table/data-table.types.ts`

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

**Execute type definitions operation for: $ARGUMENTS**
