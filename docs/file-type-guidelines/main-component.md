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
import { mergeRefs } from "@/utils";
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
// Barrel or deep import both work here (see the two-lane import rule);
// the barrel is shown by convention.
import { MenuRoot, MenuTrigger, MenuItem } from "./components";

/**
 * Menu
 * ============================================================
 * An accessible dropdown menu component
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/menu}
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
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/dialog}
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

### 3. Pure Helpers Live in `utils/`, Not in the Main File

The main component file MUST contain only the React component(s) it owns. Any
`export function name(...)` or `export const name = (...) => ...` whose return
value is **not JSX** is a utility and MUST live in `utils/{kebab-name}.ts`
instead. See [Utils & Constants](./utils-and-constants.md) for the file shape.

This applies regardless of whether the helper is used once or many times — the
moment it's exported, it's part of an API surface and belongs in the
convention-bearing location. A locally-scoped, non-exported `const helper = ...`
inside the component function body is acceptable.

```typescript
// ✅ CORRECT — utility in utils/, component imports it
// avatar/utils/get-initials.ts
export function getInitials(firstName?: string, lastName?: string) {
  /* ... */
}

// avatar/avatar.tsx
import { getInitials } from "./utils";
export const Avatar = (props: AvatarProps) => {
  const initials = getInitials(props.firstName, props.lastName);
  /* ... */
};
```

### 4. DisplayName Convention

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
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectOption,
} from "./components";

/**
 * Select
 * ============================================================
 * Dropdown selection component with accessibility
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/select}
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
};
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

## Accessibility Requirements

All Nimbus components MUST meet WCAG 2.1 AA accessibility standards. This
section outlines the key requirements and patterns for ensuring components are
accessible.

### React Aria Foundation

Nimbus components use React Aria Components as the accessibility foundation:

**Benefits:**

- **ARIA roles and attributes** - Automatically applied
- **Keyboard navigation** - Built-in support for standard patterns
- **Focus management** - Proper focus handling and restoration
- **Screen reader support** - Announcements and context

**Integration approach:**

```typescript
import { Button as RaButton } from 'react-aria-components';

export const Button = (props: ButtonProps) => {
  return (
    <ButtonSlot asChild>
      <RaButton {...props}>
        {children}
      </RaButton>
    </ButtonSlot>
  );
};
```

### WCAG 2.1 AA Compliance

All components must meet these WCAG principles:

#### 1. Perceivable

**Information must be presentable to users in ways they can perceive:**

- **Alternative text**: Images and icons must have text alternatives

  ```typescript
  <Icon aria-label="Close dialog" />
  // or
  <img src="logo.svg" alt="Company logo" />
  ```

- **Color contrast**: Text must meet 4.5:1 contrast ratio (3:1 for large text)
  - Use Nimbus color tokens which are contrast-tested
  - Test custom colors with contrast checkers

- **Visual indicators**: Don't rely on color alone

  ```typescript
  // ❌ WRONG - Color only
  <Text color="red.11">Error</Text>

  // ✅ CORRECT - Color + icon
  <Box display="flex" gap="200">
    <Icon name="error" color="red.11" />
    <Text color="red.11">Error</Text>
  </Box>
  ```

#### 2. Operable

**Interface components must be operable:**

- **Keyboard accessible**: All functionality available via keyboard

  ```typescript
  // React Aria handles this automatically
  <RaButton onPress={handleClick}>Click me</RaButton>

  // Standard keyboard patterns:
  // - Tab: Focus next/previous
  // - Enter/Space: Activate buttons
  // - Arrow keys: Navigate lists/menus
  // - Escape: Close overlays
  ```

- **Focus visible**: Clear focus indicators

  ```typescript
  // Nimbus provides focus styles via design tokens
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'primary.9',
    outlineOffset: '2px',
  }
  ```

- **No keyboard traps**: Users can navigate away from any component
  ```typescript
  // For modals/dialogs, React Aria handles focus trapping
  // and restoration automatically
  ```

#### 3. Understandable

**Information and operation must be understandable:**

- **Labels and instructions**: All inputs must have labels

  ```typescript
  // ✅ CORRECT - Visible label
  <Field.Root>
    <Field.Label>Email address</Field.Label>
    <TextInput name="email" />
  </Field.Root>

  // ✅ CORRECT - aria-label for icon-only
  <IconButton aria-label="Close" icon="close" />
  ```

- **Error identification**: Errors must be clearly described

  ```typescript
  <Field.Root invalid>
    <Field.Label>Email</Field.Label>
    <TextInput name="email" />
    <Field.ErrorMessage>
      Please enter a valid email address
    </Field.ErrorMessage>
  </Field.Root>
  ```

- **Consistent navigation**: Predictable behavior and patterns

#### 4. Robust

**Content must be robust enough for assistive technologies:**

- **Valid HTML**: Use semantic HTML elements

  ```typescript
  // ✅ CORRECT - Semantic HTML
  <button type="button">Click me</button>
  <nav>...</nav>
  <main>...</main>

  // ❌ WRONG - div soup
  <div onClick={handleClick}>Click me</div>
  ```

- **Proper ARIA usage**: React Aria provides correct ARIA attributes

### Keyboard Navigation Patterns

Different component types have standard keyboard patterns:

#### Buttons and Links

- **Enter/Space**: Activate
- **Tab**: Move focus to next element

#### Menus and Dropdowns

- **Enter/Space**: Open menu
- **Arrow Down/Up**: Navigate items
- **Enter**: Select item
- **Escape**: Close menu

#### Dialogs and Modals

- **Escape**: Close dialog
- **Tab**: Cycle through focusable elements (focus trap)
- **Focus returns** to trigger element on close

#### Form Fields

- **Tab**: Move between fields
- **Arrow keys**: Navigate radio groups, selects
- **Space**: Toggle checkboxes
- **Enter**: Submit form (when in input)

### Focus Management

Proper focus handling is critical for keyboard users:

**Focus indicators:**

```typescript
// All interactive elements must have visible focus
_focusVisible: {
  outline: '2px solid',
  outlineColor: 'primary.9',
  outlineOffset: '2px',
}
```

**Focus restoration:**

```typescript
// React Aria handles this for overlays
// Focus returns to trigger when dialog closes
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    {/* Focus trapped here while open */}
  </Dialog.Content>
</Dialog.Root>
```

**Initial focus:**

```typescript
// Set initial focus in overlays
<Dialog.Content>
  <TextInput autoFocus name="search" />
  {/* ... */}
</Dialog.Content>
```

### Screen Reader Support

Ensure components work well with screen readers:

**Descriptive labels:**

```typescript
// ✅ CORRECT - Clear purpose
<IconButton aria-label="Close navigation menu" icon="close" />

// ❌ WRONG - Vague
<IconButton aria-label="Close" icon="close" />
```

**Live regions for dynamic updates:**

```typescript
// Announce important changes
<Box role="status" aria-live="polite">
  {successMessage}
</Box>

// Urgent announcements
<Box role="alert" aria-live="assertive">
  {errorMessage}
</Box>
```

**Hidden content:**

```typescript
// Visually hidden but available to screen readers
<VisuallyHidden>
  Additional context for screen reader users
</VisuallyHidden>
```

### Testing Accessibility

**Automated testing:**

```typescript
// Storybook stories with play functions
export const Base: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Click me" });

    // Test keyboard activation
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    // Verify ARIA attributes
    expect(button).toHaveAttribute("aria-pressed", "true");
  },
};
```

**Manual testing checklist:**

- [ ] Navigate with keyboard only (no mouse)
- [ ] Test with screen reader (VoiceOver, NVDA, JAWS)
- [ ] Check color contrast ratios
- [ ] Verify focus indicators are visible
- [ ] Test with browser zoom at 200%
- [ ] Verify all interactive elements have labels

### Common Accessibility Patterns

**Icon-only buttons:**

```typescript
<IconButton
  aria-label="Delete item"
  icon="trash"
  onPress={handleDelete}
/>
```

**Loading states:**

```typescript
<Button isLoading aria-label="Loading, please wait">
  Submit
</Button>
```

**Disabled state communication:**

```typescript
<Button
  isDisabled
  aria-disabled="true"
  title="Complete the form to enable"
>
  Submit
</Button>
```

**Expandable content:**

```typescript
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Trigger aria-expanded={isOpen}>
      Section title
    </Accordion.Trigger>
    <Accordion.Content>
      {/* Content */}
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Resources

- **React Aria Documentation**: https://react-spectrum.adobe.com/react-aria/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **Nimbus Accessibility Guide**: See `docs/accessibility-guide.md` (if
  available)

## Cross-Component Imports

See [Barrel Exports: The Rule](./barrel-exports.md#the-rule-locked) for Nimbus's
two-lane import convention (canonical source). Implementation files — like this
one — are in the **Building Nimbus** lane: import other Nimbus components/types
via the `@/` alias. Barrel or deep path — **it does not matter**, both are safe
(value `export *` is banned repo-wide, which is what makes this true).

```typescript
// ✅ Both are correct — barrel-vs-deep no longer matters
import { Icon } from "@/components/icon";
import { Icon } from "@/components/icon/icon";

import type { ToggleButtonProps } from "@/components/toggle-button";
import type { ToggleButtonProps } from "@/components/toggle-button/toggle-button.types";
```

Within the same component directory, keep using relative paths
(`./button.slots`, `./button.types`). Utils and hooks (`@/utils`, `@/hooks`) are
always safe via barrel.

Stories, tests, and doc examples are in the **Using Nimbus** lane and import
components from the published package instead:

```typescript
// Consumer code (and story/test/doc files) - this is fine!
import { Button, Badge, Icon } from "@commercetools/nimbus";
```

## Internationalization (i18n)

### When Needed

Components need i18n when they contain:

- Accessibility labels (aria-label, aria-description)
- User-facing text (tooltips, placeholders, status messages)
- Interactive element labels (buttons, inputs)

### Import Pattern

```typescript
import { useLocalizedStringFormatter } from "@/hooks";
import { {componentName}MessagesStrings } from "./{component-name}.messages";
```

### Usage in Component

```typescript
export const NumberInput = (props: NumberInputProps) => {
  const msg = useLocalizedStringFormatter(numberInputMessagesStrings);

  // Use for aria-labels
  const incrementLabel = msg.format("increment");
  const decrementLabel = msg.format("decrement");

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

Include comprehensive JSDoc for the main export with a mandatory link to the
live documentation:

````typescript
/**
 * ComponentName
 * ============================================================
 * Brief description of what the component does
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/category/component-name}
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
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
- [ ] **For compound: sub-components imported from `./components`** (barrel or
      deep path — both safe, see
      [barrel-exports.md](./barrel-exports.md#the-rule-locked))
- [ ] For compound: `.Root` is FIRST property
- [ ] For single: implementation present
- [ ] DisplayName set for all exported components
- [ ] React Aria imports use `Ra` prefix
- [ ] Types re-exported appropriately
- [ ] i18n messages imported if component has user-facing text
- [ ] All aria-labels use msg.format()
- [ ] **No utility exports** — pure helpers (any `export function` or
      `export const` whose return value is not JSX) MUST live in
      `utils/{kebab-name}.ts`, not in the main component file. See
      [Utils & Constants](./utils-and-constants.md).

### JSDoc Documentation

- [ ] Main component has JSDoc with description and example
- [ ] **Main component JSDoc includes `@see` link to live documentation site**
- [ ] **`@see` link uses `{@link URL}` format**
- [ ] **`@see` link placed before `@example` block**
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

---

[← Back to Index](../component-guidelines.md) |
[Previous: Barrel Exports](./barrel-exports.md) | [Next: Types →](./types.md)
