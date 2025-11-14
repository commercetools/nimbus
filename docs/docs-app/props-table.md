# PropsTable Component

Documentation for the PropsTable component that displays TypeScript prop definitions in the documentation site.

## Overview

The PropsTable component automatically extracts and displays TypeScript prop definitions from component type files, providing a formatted API reference for each component.

## Usage

In MDX files, use the PropsTable component to display component props:

```markdown
## API

<PropsTable id="Button" />
```

This renders a table showing all props for the Button component, including:
- Prop name
- Type definition
- Description (from JSDoc)
- Default value
- Whether required

## Component ID Parameter

The `id` parameter must match the component's exported name:

### Simple Components

```markdown
<PropsTable id="Button" />
<PropsTable id="Badge" />
<PropsTable id="TextInput" />
```

### Compound Components

For compound components, use the **base namespace name**, not sub-component names:

```markdown
<!-- ✅ Correct -->
<PropsTable id="Menu" />
<PropsTable id="Select" />
<PropsTable id="Dialog" />

<!-- ❌ Incorrect -->
<PropsTable id="Menu.Root" />
<PropsTable id="Menu.Item" />
```

The PropsTable will display props for all parts of the compound component.

## How It Works

### 1. Type Extraction

The `@commercetools/nimbus-docs-build` package uses `react-docgen-typescript` to:

1. Locate `*.types.ts` files in component directories
2. Parse TypeScript AST
3. Extract exported type/interface definitions
4. Parse JSDoc comments for descriptions
5. Extract `@default` tags for default values
6. Generate `props.json` with all extracted data

### 2. Data Storage

Extracted prop data is stored in `apps/docs/src/data/props.json`:

```json
{
  "Button": {
    "variant": {
      "name": "variant",
      "type": "\"solid\" | \"outline\" | \"ghost\"",
      "description": "Visual style variant of the button",
      "defaultValue": "\"solid\"",
      "required": false
    },
    "size": {
      "name": "size",
      "type": "\"sm\" | \"md\" | \"lg\"",
      "description": "Size variant of the button",
      "defaultValue": "\"md\"",
      "required": false
    },
    "isDisabled": {
      "name": "isDisabled",
      "type": "boolean",
      "description": "Whether the button is disabled",
      "defaultValue": "false",
      "required": false
    }
  }
}
```

### 3. Runtime Display

The PropsTable component:

1. Reads `props.json` at runtime
2. Looks up component by `id` parameter
3. Renders formatted table with prop definitions
4. Applies syntax highlighting to types
5. Formats descriptions from JSDoc

## Prop Table Format

The rendered table includes these columns:

| Column | Description |
|--------|-------------|
| **Prop** | Prop name, with required indicator if applicable |
| **Type** | TypeScript type definition with syntax highlighting |
| **Default** | Default value if specified |
| **Description** | JSDoc description |

## Requirements for Type Extraction

### Type File Structure

Props must be defined in `{component}.types.ts`:

```typescript
// button.types.ts
import type { ButtonSlotProps } from './button.slots';

/**
 * Props for the Button component
 */
export type ButtonProps = ButtonSlotProps & {
  /**
   * Visual style variant of the button
   * @default "solid"
   */
  variant?: "solid" | "outline" | "ghost";

  /**
   * Size variant of the button
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;
};
```

### JSDoc Requirements

For props to appear correctly in PropsTable:

1. **Prop-level JSDoc** - Add JSDoc comment above each prop
2. **Description** - Clear, concise explanation
3. **@default tag** - Specify default value when applicable

```typescript
/**
 * Description of the prop
 * @default defaultValue
 */
propName?: type;
```

### Exported Types

Types must be **exported** to be extracted:

```typescript
// ✅ Correct - exported
export type ButtonProps = {
  // props
};

// ❌ Incorrect - not exported
type ButtonProps = {
  // props
};
```

## Compound Component Props

For compound components, PropsTable can display props for all parts:

### Root Component Props

```typescript
// menu.types.ts
export type MenuRootProps = MenuRootSlotProps & {
  /**
   * Controlled open state
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;
};
```

### Sub-Component Props

```typescript
export type MenuItemProps = MenuItemSlotProps & {
  /**
   * Unique value for the menu item
   */
  value: string;

  /**
   * Whether the item is disabled
   * @default false
   */
  isDisabled?: boolean;
};
```

When using `<PropsTable id="Menu" />`, both prop sets are displayed with section headers.

## Troubleshooting

### "Component not found" Error

**Problem:** PropsTable displays "Component '{id}' not found"

**Solutions:**

1. **Check component name**
   - Ensure `id` matches exported component name exactly
   - Names are case-sensitive: `"Button"` ≠ `"button"`

2. **Verify export**
   - Component type must be exported from types file
   - Check: `export type ComponentProps = {...}`

3. **Rebuild data**
   ```bash
   pnpm --filter @commercetools/nimbus-docs-build build
   ```

4. **Check props.json**
   - Open `apps/docs/src/data/props.json`
   - Search for component name
   - If missing, type extraction failed

### Props Not Displaying

**Problem:** PropsTable shows but props are missing

**Solutions:**

1. **Add JSDoc comments**
   - Each prop needs JSDoc comment
   - Even inherited props need documentation

2. **Check type structure**
   - Props must be in object type/interface
   - Avoid complex type manipulations

3. **Rebuild and check extraction**
   - Rebuild: `pnpm --filter @commercetools/nimbus-docs-build build`
   - Check console for TypeScript errors

### Types Show as "any"

**Problem:** Prop types display as `any` or are incomplete

**Solutions:**

1. **Explicit typing**
   - Avoid implicit types
   - Use explicit type annotations

2. **Avoid conditional types**
   - Complex conditional types may not extract properly
   - Use union types when possible

3. **Check imports**
   - Imported types must be resolvable
   - Use `type` imports: `import type { ... }`

### Default Values Not Showing

**Problem:** Default column is empty

**Solutions:**

1. **Add @default JSDoc tag**
   ```typescript
   /**
    * Description
    * @default "value"
    */
   prop?: type;
   ```

2. **Use string format**
   - For strings: `@default "value"`
   - For numbers: `@default 42`
   - For booleans: `@default false`

## Best Practices

### DO

- ✅ Add JSDoc to every prop
- ✅ Specify `@default` for props with defaults
- ✅ Use clear, concise descriptions
- ✅ Export all prop types
- ✅ Use semantic type names
- ✅ Rebuild after type changes

### DON'T

- ❌ Skip JSDoc on props
- ❌ Use complex conditional types
- ❌ Forget to export types
- ❌ Use vague descriptions
- ❌ Assume inherited props auto-document

## Related Documentation

- [Type Definitions Guidelines](../nimbus/file-type-guidelines/types.md) - How to write type files
- [MDX Format](./mdx-format.md) - Using PropsTable in MDX
- [Build System](./build-system.md) - How props are extracted

## Example Output

Given this type definition:

```typescript
export type ButtonProps = ButtonSlotProps & {
  /**
   * Visual style variant of the button
   * @default "solid"
   */
  variant?: "solid" | "outline" | "ghost";

  /**
   * Size variant of the button
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether the button is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Button content
   */
  children: React.ReactNode;
};
```

PropsTable renders:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual style variant of the button |
| size | `"sm" \| "md" \| "lg"` | `"md"` | Size variant of the button |
| isDisabled | `boolean` | `false` | Whether the button is disabled |
| children * | `React.ReactNode` | - | Button content |

(* indicates required prop)
