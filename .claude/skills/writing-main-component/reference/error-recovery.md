# Error Recovery Reference

### Error 1: Ref Forwarding Issues

**Problem**: "Property 'ref' does not exist" or refs not working in parent
components

**Root Causes**:

- Missing ref extraction from props
- Not merging local and forwarded refs
- Not using `useObjectRef` for React Aria compatibility

**Solutions**:

```typescript
// ✅ CORRECT - Complete ref forwarding pattern
const { ref: forwardedRef, ...rest } = props;
const localRef = useRef<HTMLButtonElement>(null);
const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

return <RaButton {...rest} ref={ref}>{children}</RaButton>;

// ❌ WRONG - Missing local ref (needed for hooks)
const { ref, ...rest } = props;
return <RaButton {...rest} ref={ref}>{children}</RaButton>;

// ❌ WRONG - Not merging refs (loses forwarded ref)
const localRef = useRef<HTMLButtonElement>(null);
return <RaButton {...rest} ref={localRef}>{children}</RaButton>;
```

**Detection**: Ref forwarding issues typically manifest as:

- Parent components can't access child component's DOM node
- Focus management breaks
- Measurement/positioning calculations fail

---

### Error 2: Props Spreading Order

**Problem**: Style props not applying, variants not working, or event handlers
not firing

**Root Cause**: Props spread in wrong order causes later props to override
earlier props

**Solutions**:

```typescript
// ✅ CORRECT - Recipe → Style → Functional
const [recipeProps, rest1] = recipe.splitVariantProps(props);
const [styleProps, functionalProps] = extractStyleProps(rest1);

return (
  <ComponentSlot {...recipeProps} {...styleProps} asChild>
    <RaButton {...functionalProps}>{children}</RaButton>
  </ComponentSlot>
);

// ❌ WRONG - Functional first (gets overridden by style)
<ComponentSlot {...functionalProps} {...recipeProps} {...styleProps}>

// ❌ WRONG - Not extracting style props separately
<ComponentSlot {...allPropsUnsplit}>
```

**Detection**: Props order issues manifest as:

- Margin/padding style props don't apply
- Variant styles override custom props
- Event handlers don't fire

---

### Error 3: React Aria Import Conflicts

**Problem**: TypeScript errors about naming conflicts or type mismatches

**Root Cause**: Not using `Ra` prefix causes naming conflicts between Nimbus and
React Aria components

**Solutions**:

```typescript
// ✅ CORRECT - Ra prefix avoids conflicts
import { Button as RaButton } from "react-aria-components";
import type { ButtonProps as RaButtonProps } from "react-aria-components";

// ❌ WRONG - No prefix causes conflicts
import { Button } from "react-aria-components"; // Conflicts with Nimbus Button!
```

**Detection**: Import conflict errors appear as:

- "Cannot redeclare block-scoped variable 'Button'"
- Type errors when using the component
- IDE showing wrong type definitions

---

### Error 4: Cross-Component Import Cycles

**Problem**: "Circular dependency" warnings during build, or components fail to
import

**Root Cause**: Using barrel exports (`index.ts`) for cross-component imports
creates circular dependencies

**Solutions**:

```typescript
// ✅ CORRECT - Direct file imports
import { IconButton } from "@/components/icon-button/icon-button";
import type { ButtonProps } from "../button/button.types";

// ❌ WRONG - Barrel exports create circular dependencies
import { IconButton } from "@/components/icon-button"; // Uses index.ts
import type { ButtonProps } from "../button"; // Uses index.ts

// ✅ CORRECT - Internal imports (same directory) use relative paths
import { ButtonSlot } from "./button.slots";
import type { ButtonProps } from "./button.types";
```

**Detection**: Import cycle issues manifest as:

- Build warnings about circular dependencies
- Components imported as `undefined`
- Webpack/build chunking errors

---

### Error 5: Missing DisplayName

**Problem**: Components show as "Anonymous" in React DevTools, making debugging
difficult. For a compound sub-component, a missing or malformed `displayName`
also means the docs pipeline cannot generate its prop table — it keys on the
exact `Parent.Key` string (e.g. `Menu.Trigger`).

**Root Cause**: Forgot to set `displayName` property, or set it to something
other than the exact `Parent.Key` string for a compound part

**Solutions**:

```typescript
// ✅ CORRECT - Single component
export const Button = (props: ButtonProps) => {
  /* ... */
};
Button.displayName = "Button";

// ✅ CORRECT - Compound component part
export const MenuRoot = (props: MenuRootProps) => {
  /* ... */
};
MenuRoot.displayName = "Menu.Root";

// ❌ WRONG - Missing entirely
export const Button = (props: ButtonProps) => {
  /* ... */
};
// No displayName set
```

**Detection**: Missing displayName shows as:

- `<Anonymous>` in React DevTools component tree
- Difficult to identify components during debugging
- Error stack traces show `<Anonymous>` instead of component name

---

### Error 6: Missing @see Link

**Problem**: Documentation site generation fails or component pages incomplete

**Root Cause**: JSDoc missing required `@see` link to live documentation

**Solutions**:

````typescript
// ✅ CORRECT - {@link URL} format
/**
 * Button
 * ============================================================
 * An accessible button component...
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/button}
 *
 * @example
 * ```tsx
 * <Button variant="primary">Click me</Button>
 * ```
 */

// ❌ WRONG - Plain URL without {@link}
/**
 * @see https://nimbus-documentation.vercel.app/components/inputs/button
 */

// ❌ WRONG - Missing entirely
/**
 * Button component
 */
````

**Detection**: Missing @see link causes:

- Documentation extraction warnings
- Component API page missing documentation link
- Navigation broken between docs and code

---

### Error 7: Compound Component Root Not First

**Problem**: Component API contract broken, unexpected behavior in usage

**Root Cause**: `.Root` is not the first property in compound component export
object

**Solutions**:

```typescript
// ✅ CORRECT - Root is FIRST property
export const Menu = {
  Root: MenuRoot, // FIRST (required)
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
};

// ❌ WRONG - Alphabetical order
export const Menu = {
  Content: MenuContent,
  Item: MenuItem,
  Root: MenuRoot, // Not first!
  Trigger: MenuTrigger,
};

// ❌ WRONG - Logical grouping
export const Menu = {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Root: MenuRoot, // Not first!
};
```

**Detection**: Root not first causes:

- API documentation shows wrong order
- Developers confused about component structure
- Violates established API contract

---

### Error 8: Style Props Not Working

**Problem**: Margin, padding, color, and other Chakra UI style props don't apply
to component

**Root Causes**:

- Not using `extractStyleProps` to separate style props from functional props
- Not forwarding style props to slot component
- Missing `@supportsStyleProps` JSDoc tag

**Solutions**:

```typescript
// ✅ CORRECT - Extract and forward style props
import { extractStyleProps } from '@/utils';

export const Button = (props: ButtonProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <ButtonSlot {...styleProps} asChild>
      <RaButton {...functionalProps}>
        {functionalProps.children}
      </RaButton>
    </ButtonSlot>
  );
};

// Also add JSDoc tag:
/**
 * @supportsStyleProps
 */

// ❌ WRONG - Not extracting style props
export const Button = (props: ButtonProps) => {
  return (
    <ButtonSlot asChild>
      <RaButton {...props}>
        {props.children}
      </RaButton>
    </ButtonSlot>
  );
};
```

**Detection**: Style props not working manifests as:

- `margin`, `padding`, `color` props have no effect
- Component doesn't respond to responsive array syntax
- Style props passed but not rendered in DOM

---
