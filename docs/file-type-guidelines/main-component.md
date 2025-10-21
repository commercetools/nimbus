# Main Component File Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Barrel Exports](./barrel-exports.md) | [Next: Types →](./types.md)

## Purpose

The main component file (`{component-name}.tsx`) serves as either the
implementation home for simple components or the export facade for compound
components. It defines how consumers interact with your component.

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

````typescript
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
  /**
   * # Menu.Root
   *
   * The root component that provides context and state management for the menu.
   * Must wrap all menu parts (Trigger, Content, Item) to coordinate their behavior.
   *
   *
   * @example
   * ```tsx
   * <Menu.Root>
   *   <Menu.Trigger>Open Menu</Menu.Trigger>
   *   <Menu.Content>
   *     <Menu.Item>Edit</Menu.Item>
   *   </Menu.Content>
   * </Menu.Root>
   * ```
   */
  Root: MenuRoot, // ⚠️ MUST BE FIRST - primary entry point
  /**
   * # Menu.Trigger
   *
   * The trigger element that opens the menu when activated.
   * Handles keyboard and mouse interactions for menu activation.
   *
   *
   * @example
   * ```tsx
   * <Menu.Root>
   *   <Menu.Trigger>Options</Menu.Trigger>
   *   <Menu.Content>...</Menu.Content>
   * </Menu.Root>
   * ```
   */
  Trigger: MenuTrigger,
  /**
   * # Menu.Content
   *
   * The container for menu items and sections.
   * Handles positioning, portal rendering, and keyboard navigation.
   *
   *
   * @example
   * ```tsx
   * <Menu.Root>
   *   <Menu.Trigger>Options</Menu.Trigger>
   *   <Menu.Content>
   *     <Menu.Item>Edit</Menu.Item>
   *     <Menu.Item>Delete</Menu.Item>
   *   </Menu.Content>
   * </Menu.Root>
   * ```
   */
  Content: MenuContent,
  /**
   * # Menu.Item
   *
   * An individual menu item that can be selected by the user.
   * Supports keyboard navigation, disabled states, and custom actions.
   *
   *
   * @example
   * ```tsx
   * <Menu.Content>
   *   <Menu.Item onAction={() => console.log('Edit')}>Edit</Menu.Item>
   *   <Menu.Item isDisabled>Delete</Menu.Item>
   * </Menu.Content>
   * ```
   */
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
````

### Documenting Compound Component Parts

**CRITICAL**: Each part in a compound component namespace object **MUST** have
JSDoc documentation directly above it in the main export file. This
documentation serves as the primary API reference for developers.

#### Required JSDoc Structure for Each Part

Every compound component part must include:

1. **Heading**: Start with `# ComponentName.Part` format
2. **Description**: Brief explanation of the part's purpose and when to use it
   (1-3 sentences)
3. **Example**: Show typical usage with `@example` block

#### JSDoc Template for Compound Component Parts

Use this template for documenting compound component parts:

````typescript
/**
 * # ComponentName.PartName
 *
 * [Brief description of what this part does and its purpose within the component.]
 * [Additional context about behavior, state, or interactions if needed.]
 *
 * @example
 * ```tsx
 * <ComponentName.Root>
 *   <ComponentName.PartName>[relevant example]</ComponentName.PartName>
 * </ComponentName.Root>
 * ```
 */
PartName: ComponentPartName,
````

**Note**: Place `@supportsStyleProps` tags directly above component functions in
implementation files for documentation generation. The parser extracts metadata
from implementation files (see
[Compound Components Guidelines](./compound-components.md#jsdoc-tags-in-implementation-files-critical)).

#### Common Part Types and Description Patterns

Use these patterns as starting points for different part types:

**Root Components:**

````typescript
/**
 * # ComponentName.Root
 *
 * The root component that provides context and state management for the [component].
 * Must wrap all [component] parts to coordinate their behavior.
 *
 * @example
 * ```tsx
 * <ComponentName.Root>
 *   <ComponentName.Trigger>Open</ComponentName.Trigger>
 *   <ComponentName.Content>...</ComponentName.Content>
 * </ComponentName.Root>
 * ```
 */
````

**Trigger Components:**

````typescript
/**
 * # ComponentName.Trigger
 *
 * The trigger element that [opens/toggles/activates] the [component] when activated.
 * Handles keyboard and mouse interactions for [component] activation.
 *
 * @example
 * ```tsx
 * <ComponentName.Trigger>Open [Component]</ComponentName.Trigger>
 * ```
 */
````

**Content/Container Components:**

````typescript
/**
 * # ComponentName.Content
 *
 * The container for [component] [items/sections/content].
 * Handles positioning, portal rendering, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <ComponentName.Content>
 *   {/* Content here */}
 * </ComponentName.Content>
 * ```
 */
````

**Item Components:**

````typescript
/**
 * # ComponentName.Item
 *
 * An individual [item/option/entry] within the [component].
 * Supports keyboard navigation, disabled states, and custom actions.
 *
 * @example
 * ```tsx
 * <ComponentName.Item value="item-1">Item Label</ComponentName.Item>
 * ```
 */
````

#### Complete Working Example

See the Dialog component for a complete reference implementation of compound
component part documentation:

````typescript
/**
 * Dialog
 * ============================================================
 * A foundational dialog component for overlays that require user attention.
 * Built with React Aria Components for accessibility and WCAG 2.1 AA compliance.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Title</Dialog.Title>
 *     </Dialog.Header>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const Dialog = {
  /**
   * # Dialog.Root
   *
   * The root component that provides context and state management for the dialog.
   * Uses React Aria's DialogTrigger for accessibility and keyboard interaction.
   *
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Trigger>Open</Dialog.Trigger>
   *   <Dialog.Content>...</Dialog.Content>
   * </Dialog.Root>
   * ```
   */
  Root: DialogRoot,
  /**
   * # Dialog.Trigger
   *
   * The trigger element that opens the dialog when activated.
   * Uses React Aria's Button for accessibility and keyboard support.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog.Content>...</Dialog.Content>
   * </Dialog.Root>
   * ```
   */
  Trigger: DialogTrigger,
  // ... other parts with similar documentation
};
````

## Critical Rules

### 1. Compound Components MUST Have .Root

**This is non-negotiable** - All compound components must:

- Export a namespace object
- Have `.Root` as the FIRST property
- Root accepts all theme/variant props

```typescript
// ✅ CORRECT
export const Component = {
  Root: ComponentRoot, // FIRST property
  Part: ComponentPart,
};

Note: Compound components must have Root as first property for proper API design.
```

### 2. Implementation Location

- **Single components**: Implementation in main file OR components/ folder
- **Compound components**: Implementation ALWAYS in components/ folder

```typescript
// ✅ Single component - implementation in main file
// button.tsx
export const Button = (props) => {
  /* implementation */
};

// ✅ Compound component - no implementation in main file
// menu.tsx
export const Menu = {
  Root: MenuRoot, // Imported from ./components/menu.root.tsx
};
```

### 3. DisplayName Convention

Always set displayName for debugging:

```typescript
// Single component
Button.displayName = "Button";

// Compound component parts (in components/ files)
MenuRoot.displayName = "Menu.Root";
MenuTrigger.displayName = "Menu.Trigger";
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
import { SelectRoot } from "./components/select-root";
import { SelectTrigger } from "./components/select-trigger";
import { SelectOption } from "./components/select-option";

export type * from "./select.types";

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
export { SelectRoot as _SelectRoot, SelectTrigger as _SelectTrigger };
```

## React Aria Integration

### Import Convention

Always use `Ra` prefix for React Aria components:

```typescript
import { Button as RaButton } from "react-aria-components";
import { Select as RaSelect } from "react-aria-components";
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

## Internationalization (i18n)

### When Needed

Components need i18n when they contain:

- Accessibility labels (aria-label, aria-description)
- User-facing text (tooltips, placeholders, status messages)
- Interactive element labels (buttons, inputs)

### Import Pattern

```typescript
import { useIntl } from "react-intl";
import { messages } from "./component-name.i18n";
```

### Usage in Component

```typescript
export const NumberInput = (props: NumberInputProps) => {
  const intl = useIntl();

  // Use for aria-labels
  const incrementLabel = intl.formatMessage(messages.increment);
  const decrementLabel = intl.formatMessage(messages.decrement);

  // Pass to React Aria hooks
  const ariaProps = {
    ...functionalProps,
    incrementAriaLabel: incrementLabel,
    decrementAriaLabel: decrementLabel,
  };

  const { inputProps, incrementButtonProps, decrementButtonProps } =
    useNumberField(ariaProps, state, ref);

  return (
    <button aria-label={incrementLabel}>
      <PlusIcon />
    </button>
  );
};
```

### Common i18n Use Cases

1. **Icon-only buttons** - Always need aria-labels
2. **Loading states** - Loading messages for screen readers
3. **Clear/dismiss buttons** - Action labels
4. **Form inputs** - Placeholder text and validation messages
5. **Tooltips** - Helpful context for users

See [i18n Guidelines](./i18n.md) for complete documentation.

## Documentation Requirements

### JSDoc Comments

Include comprehensive JSDoc for the main export:

````typescript
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
````

### Style Props Support Tag

Components that accept Chakra UI style props (margin, padding, color, etc.)
**must** include the `@supportsStyleProps` JSDoc tag:

```typescript
/**
 * ComponentName - Brief description
 *
 * @supportsStyleProps
 */
export const ComponentName = (props: ComponentNameProps) => {
  // Implementation forwards style props to underlying styled component
  return (
    <ComponentSlot {...props}>
      {/* implementation */}
    </ComponentSlot>
  );
};
```

**When Required** - Add this tag if the component supports Chakra UI style props
through ANY of these patterns:

- ✅ Component type extends `HTMLChakraProps` (directly or via slot props)
- ✅ Component uses `extractStyleProps()` and forwards style props to slot
  components
- ✅ Component forwards all props to an underlying Chakra/Nimbus component that
  supports style props
- ✅ Component wraps a slot component that accepts style props

**Key Indicator**: If users can pass `margin`, `padding`, `backgroundColor`, or
other Chakra style props to your component and they work, add the tag.

**Applies To**:

- Root components in compound component patterns
- Sub-components that accept and forward style props (Item, Header, Content,
  etc.)
- Single components that extend HTMLChakraProps or slot props
- Wrapper components that forward props to styled children

**Examples**:

```typescript
// Pattern 1: Using extractStyleProps
/**
 * Accordion.Root - Provides state management for accordion
 *
 * @supportsStyleProps
 */
export const AccordionRoot = (props: AccordionRootProps) => {
  const recipe = useSlotRecipe({ key: "accordion" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, raProps] = extractStyleProps(restRecipeProps);

  return (
    <AccordionRootSlot {...recipeProps} {...styleProps} asChild>
      <RaDisclosureGroup {...raProps} />
    </AccordionRootSlot>
  );
};

// Pattern 2: Forwarding all props to styled component
/**
 * Card.Header - Header section of the card
 *
 * @supportsStyleProps
 */
export const CardHeader = (props: CardHeaderProps) => {
  return (
    <CardHeaderSlot {...props}>
      {props.children}
    </CardHeaderSlot>
  );
};

// Pattern 3: Forwarding to underlying Nimbus component
/**
 * CustomButton - Specialized button wrapper
 *
 * @supportsStyleProps
 */
export const CustomButton = (props: CustomButtonProps) => {
  return <Button {...props} variant="special" />;
};
```

## Related Guidelines

- [Compound Components](./compound-components.md) - Detailed compound patterns
- [Types](./types.md) - Props interface patterns
- [Slots](./slots.md) - Slot wrapper integration
- [i18n](./i18n.md) - Internationalization patterns
- [Architecture Decisions](./architecture-decisions.md) - When to use compound

## Validation Checklist

### General

- [ ] Main component file exists
- [ ] For compound: exports only, no implementation
- [ ] For compound: `.Root` is FIRST property
- [ ] For single: implementation present
- [ ] DisplayName set for all exported components
- [ ] React Aria imports use `Ra` prefix
- [ ] Types re-exported appropriately
- [ ] i18n messages imported if component has user-facing text
- [ ] All aria-labels use intl.formatMessage

### JSDoc Documentation

- [ ] Main component has JSDoc with description and example
- [ ] **For compound components: Each part has JSDoc documentation in main
      file**
- [ ] **Each part's JSDoc includes heading (# ComponentName.Part)**
- [ ] **Each part's JSDoc includes purpose description (1-3 sentences)**
- [ ] **Each part's JSDoc includes `@example` block showing usage**
- [ ] **`@supportsStyleProps` tag placed in implementation files** (for doc
      generation)
- [ ] Main component `@supportsStyleProps` tag added if applicable (single
      components only)

### Exports

- [ ] Internal exports for react-docgen (compound components only)
- [ ] All parts properly exported with underscore prefix for react-docgen

---

[← Back to Index](../component-guidelines.md) |
[Previous: Barrel Exports](./barrel-exports.md) | [Next: Types →](./types.md)
