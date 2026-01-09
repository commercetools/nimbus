# JSDoc Standards

JSDoc comments document the public API and enable automated documentation
extraction in the Nimbus design system. This document consolidates all JSDoc
requirements across component types, test files, and documentation.

## Purpose

- **API Documentation**: Define the public interface for component consumers
- **Developer Experience**: Provide inline documentation in IDEs
- **Automated Extraction**: Enable JSDoc-based documentation generation
- **Type Safety Enhancement**: Complement TypeScript with semantic information

---

## Component Props JSDoc (Required)

### All Properties MUST Have JSDoc

Every property in a public props interface MUST have a JSDoc comment:

```typescript
export type ButtonProps = ButtonRootSlotProps & {
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to display before the button text
   * @example <Icon name="add" />
   */
  startIcon?: React.ReactNode;

  /**
   * Reference to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
};
```

### Required vs. Optional JSDoc

- **Required**: JSDoc comments for every property within types
- **Optional**: JSDoc comments on type definitions themselves (use for complex
  types)

---

## JSDoc Tags Reference

### @default (REQUIRED for optional props with defaults)

Specify the default value for optional properties:

```typescript
/**
 * Size of the button
 * @default "md"
 */
size?: "sm" | "md" | "lg";

/**
 * Whether the button is disabled
 * @default false
 */
isDisabled?: boolean;

/**
 * Maximum number of items to display
 * @default 10
 */
maxItems?: number;
```

**When to use:**

- All optional props that have default values in the implementation
- Makes the API self-documenting

**When NOT to use:**

- Required props (they don't have defaults)
- Optional props without defaults (omit the tag)

### @example (RECOMMENDED for complex props)

Provide usage examples for non-obvious properties:

```typescript
/**
 * Custom render function for items
 * @example
 * renderItem={(item) => <div>{item.name}</div>}
 */
renderItem?: (item: T) => ReactNode;

/**
 * Validation function for form field
 * @example
 * validate={(value) => value.length > 5 ? null : "Too short"}
 */
validate?: (value: string) => string | null;

/**
 * Date range selection
 * @example
 * value={{ start: new Date('2024-01-01'), end: new Date('2024-01-31') }}
 */
value?: DateRange;
```

**When to use:**

- Function props (callbacks, render functions)
- Complex object structures
- Props with non-obvious usage patterns

### @deprecated (REQUIRED for deprecated props)

Mark properties that should no longer be used:

```typescript
/**
 * Old prop name for disabled state
 * @deprecated Use `isDisabled` instead
 */
disabled?: boolean;

/**
 * Legacy variant name
 * @deprecated Use `variant="secondary"` instead. Will be removed in v3.0
 */
isSecondary?: boolean;

/**
 * Previous color scheme approach
 * @deprecated Use the `colorPalette` prop instead. Migration guide: https://nimbus.docs/migration/color-palette
 */
colorScheme?: string;
```

**When to use:**

- Props maintained for backwards compatibility
- Properties scheduled for removal
- Renamed properties

**Best practices:**

- Always provide migration guidance
- Include version number for removal if known
- Link to migration guides when available

### @see (OPTIONAL for related documentation)

Link to related documentation or types:

```typescript
/**
 * Variant style for the button
 * @see {@link https://nimbus.docs/button#variants}
 */
variant?: "solid" | "outline" | "ghost";

/**
 * Accessibility label for the button
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html} for WCAG requirements
 * @see ButtonProps for the complete prop interface
 */
"aria-label"?: string;

/**
 * Sort descriptor for the table column
 * @see SortDescriptor type for the expected shape
 */
sortDescriptor?: SortDescriptor;
```

**When to use:**

- Link to external documentation (WCAG, React Aria, etc.)
- Reference related types in the codebase
- Point to usage examples in documentation

---

## Documentation Test Tags (for .docs.spec.tsx files)

Documentation test files (`{component}.docs.spec.tsx`) use special JSDoc tags to
organize and inject test examples into `.dev.mdx` documentation.

### @docs-section (REQUIRED)

Unique identifier for the test section:

```typescript
/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify component renders correctly with default props
 * @docs-order 1
 */
describe("Button - Basic", () => {
  test("renders with default props", () => {
    // test code
  });
});
```

**Requirements:**

- Must be kebab-case
- Must be unique within the file
- Should describe the test category

### @docs-title (REQUIRED)

Human-readable title for the test section:

```typescript
/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Tests for keyboard interactions and focus management
 * @docs-order 3
 */
```

**Requirements:**

- Title Case formatting
- Clear and descriptive
- Matches the section purpose

### @docs-description (REQUIRED)

Brief description of what the test section validates:

```typescript
/**
 * @docs-section controlled-mode
 * @docs-title Controlled Component Tests
 * @docs-description Verify controlled behavior with external state management
 * @docs-order 4
 */
```

**Requirements:**

- Single sentence or short paragraph
- Explains the test scope
- Helps developers understand coverage

### @docs-order (REQUIRED)

Numeric order for section display in documentation:

```typescript
/**
 * @docs-section basic-rendering
 * @docs-order 1  // First section
 */

/**
 * @docs-section interactions
 * @docs-order 2  // Second section
 */

/**
 * @docs-section accessibility
 * @docs-order 3  // Third section
 */
```

**Requirements:**

- Positive integers
- Determines injection order in `.dev.mdx`
- Logical progression (basic → complex)

### Complete Test Section Example

```typescript
/**
 * @docs-section form-integration
 * @docs-title Form Integration Tests
 * @docs-description Tests for integration with form libraries and validation
 * @docs-order 5
 */
describe("TextInput - Form Integration", () => {
  test("integrates with React Hook Form", () => {
    // Test React Hook Form integration
  });

  test("shows validation errors", () => {
    // Test validation display
  });

  test("supports form submission", () => {
    // Test form submission
  });
});
```

---

## Writing Effective JSDoc Descriptions

### ✅ Good JSDoc Descriptions

```typescript
/**
 * Whether the button shows a loading spinner and is disabled
 * @default false
 */
isLoading?: boolean;

/**
 * Callback fired when the user selects a date from the calendar
 * @example
 * onSelect={(date) => console.log('Selected:', date)}
 */
onSelect?: (date: Date) => void;

/**
 * Visual state of the alert - determines icon and color scheme
 * @default "info"
 */
status?: "success" | "error" | "warning" | "info";
```

**What makes them good:**

- Explain behavior AND purpose
- Use active voice
- Describe consequences (e.g., "shows spinner and is disabled")
- Provide context for decisions

### ❌ Bad JSDoc Descriptions

```typescript
/**
 * Loading state
 */
isLoading?: boolean;  // Too brief, no context

/**
 * Function that gets called
 */
onSelect?: (date: Date) => void;  // Vague, no details

/**
 * Status prop
 */
status?: "success" | "error" | "warning" | "info";  // Redundant with prop name
```

**What makes them bad:**

- Too brief to be useful
- Redundant with property name
- No behavioral description
- Missing context

### Brevity vs. Clarity

**Prefer clarity over brevity:**

```typescript
// ✅ Clear and helpful
/**
 * Whether to close the dialog when clicking outside its bounds.
 * When false, users must use the close button or press Escape.
 * @default true
 */
closeOnOutsideClick?: boolean;

// ❌ Too brief
/**
 * Close on outside click
 * @default true
 */
closeOnOutsideClick?: boolean;
```

**Exception:** Simple boolean flags with obvious meaning can be brief:

```typescript
/**
 * Whether the component is disabled
 * @default false
 */
isDisabled?: boolean;  // OK - meaning is obvious
```

---

## Type Information Guidelines

### Don't Repeat TypeScript Types

TypeScript already provides type information. Focus on behavior and usage:

```typescript
// ❌ BAD - Repeats TypeScript info
/**
 * A string that represents the button size
 */
size?: "sm" | "md" | "lg";

// ✅ GOOD - Explains impact
/**
 * Size variant affecting padding and font size
 * @default "md"
 */
size?: "sm" | "md" | "lg";
```

### Explain "Why" and "When"

```typescript
// ❌ BAD - Just describes "what"
/**
 * Callback function
 */
onChange?: (value: string) => void;

// ✅ GOOD - Explains "when" and "why"
/**
 * Callback fired when the input value changes.
 * Use this for controlled components or to sync state.
 * @example
 * onChange={(value) => setSearchQuery(value)}
 */
onChange?: (value: string) => void;
```

---

## Special Cases and Patterns

### Generic Type Props

```typescript
/**
 * Items to render in the list.
 * Generic type T should match the shape of your data.
 * @example
 * items={[{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]}
 */
items: T[];

/**
 * Render function for each item.
 * Receives the item and its index in the list.
 * @example
 * renderItem={(item, index) => <div key={item.id}>{item.name}</div>}
 */
renderItem: (item: T, index: number) => ReactNode;
```

### React Aria Props (Inherited)

For props inherited from React Aria, reference the source:

```typescript
/**
 * Accessibility label for the button
 * @see {@link https://react-spectrum.adobe.com/react-aria/Button.html#aria-label} for React Aria documentation
 */
"aria-label"?: string;
```

### Compound Component Props

```typescript
/**
 * Root component for the Menu.
 * Must wrap all Menu sub-components (Trigger, Content, Item).
 * @example
 * <Menu.Root>
 *   <Menu.Trigger>Open Menu</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item>Action 1</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 */
export type MenuRootProps = ...;
```

---

## Integration with Nimbus Workflow

### When Writing Type Definitions

1. **Read this document** before creating `{component}.types.ts`
2. **Apply JSDoc to every property** in public interfaces
3. **Use appropriate tags** (@default, @example, @deprecated, @see)
4. **Focus on behavior**, not just type information

Reference: See `docs/file-type-guidelines/types.md` for complete type definition
guidelines.

### When Writing Documentation Tests

1. **Read this document** for @docs- tag requirements
2. **Add all four tags** to every test describe block (@docs-section,
   @docs-title, @docs-description, @docs-order)
3. **Order sections logically** (basic → advanced)
4. **Use injection token** in `.dev.mdx`:
   `{{docs-tests: {component-name}.docs.spec.tsx}}`

Reference: See `docs/file-type-guidelines/documentation.md` for complete
documentation guidelines.

---

## Cross-References

- **Type Definitions**: `docs/file-type-guidelines/types.md`
- **Documentation Files**: `docs/file-type-guidelines/documentation.md`
- **Component Guidelines**: `docs/component-guidelines.md`
- **Naming Conventions**: `docs/naming-conventions.md`

---

## Quick Reference Checklist

### For Component Props

- [ ] Every property has JSDoc comment
- [ ] Optional props with defaults have `@default` tag
- [ ] Complex props have `@example` tag
- [ ] Deprecated props have `@deprecated` tag with migration guidance
- [ ] Descriptions explain behavior, not just type
- [ ] Related documentation linked with `@see` tag

### For Documentation Tests

- [ ] Every describe block has all four tags
- [ ] `@docs-section` is unique and kebab-case
- [ ] `@docs-title` is clear and Title Case
- [ ] `@docs-description` explains the test scope
- [ ] `@docs-order` creates logical progression
- [ ] Injection token in `.dev.mdx` matches filename

---

## Examples by Component Tier

### Tier 1: Simple Component (Button)

```typescript
export type ButtonProps = ButtonRootSlotProps & {
  /**
   * Whether the button is in a loading state.
   * When true, shows a spinner and disables interaction.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Visual style variant
   * @default "solid"
   */
  variant?: "solid" | "outline" | "ghost";
};
```

### Tier 3: Compound Component (Menu)

```typescript
export type MenuRootProps = {
  /**
   * Whether the menu is open.
   * Use this for controlled menu state.
   * @example
   * const [isOpen, setIsOpen] = useState(false);
   * <Menu.Root open={isOpen} onOpenChange={setIsOpen}>
   */
  open?: boolean;

  /**
   * Callback fired when the menu open state changes.
   * Called when user opens, closes, or dismisses the menu.
   * @example
   * onOpenChange={(isOpen) => console.log('Menu is', isOpen ? 'open' : 'closed')}
   */
  onOpenChange?: (open: boolean) => void;
};
```

### Tier 4: Complex Component (DataTable)

```typescript
export type DataTableProps<T> = {
  /**
   * Array of data items to display in the table.
   * Generic type T should match your data model.
   * @example
   * data={[
   *   { id: 1, name: 'Alice', role: 'Admin' },
   *   { id: 2, name: 'Bob', role: 'User' }
   * ]}
   */
  data: T[];

  /**
   * Column configuration defining how to render each column.
   * Use this to specify headers, accessors, and custom renderers.
   * @example
   * columns={[
   *   { key: 'name', label: 'Name', sortable: true },
   *   { key: 'role', label: 'Role', render: (value) => <Badge>{value}</Badge> }
   * ]}
   */
  columns: Column<T>[];
};
```
