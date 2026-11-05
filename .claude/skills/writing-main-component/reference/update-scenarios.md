# Common Update Scenarios

### Common Update Scenarios

#### Scenario 1: Adding New Props

**Steps:**

1. Update types file first
2. Destructure new prop in component
3. Use new prop in implementation
4. Update JSDoc if prop changes behavior
5. Update stories to demonstrate new prop

**Example:**

```typescript
// Step 1: Update types (in component.types.ts)
export type ComponentProps = ComponentSlotProps & {
  // Existing props...

  /**
   * New prop description
   * @default "default-value"
   */
  newProp?: string;
};

// Step 2: Update component implementation
export const Component = (props: ComponentProps) => {
  const { ref: forwardedRef, newProp = "default-value", ...rest } = props;

  // Step 3: Use new prop
  return (
    <ComponentSlot {...rest} data-new-prop={newProp}>
      {props.children}
    </ComponentSlot>
  );
};
```

#### Scenario 2: Adding i18n Support

**Steps:**

1. Create i18n file if not exists: `/writing-i18n create ComponentName`
2. Import useLocalizedStringFormatter and message strings in component
3. Replace hardcoded strings with msg.format() calls
4. Update aria-labels to use i18n

**Example:**

```typescript
// Step 1: Create component.i18n.ts
export const messages = {
  closeLabel: {
    id: 'nimbus.component.closeLabel',
    defaultMessage: 'Close',
    description: 'Accessibility label for close button',
  },
});

// Step 2: Update component
import { useLocalizedStringFormatter } from '@/hooks';
import { {componentName}MessagesStrings } from './{component-name}.messages';

export const Component = (props: ComponentProps) => {
  const msg = useLocalizedStringFormatter({componentName}MessagesStrings);
  const closeLabel = msg.format("closeLabel");

  return (
    <div>
      <IconButton aria-label={closeLabel}>
        <CloseIcon />
      </IconButton>
      {props.children}
    </div>
  );
};
```

#### Scenario 3: Adding React Aria Integration

**Steps:**

1. Add React Aria dependency imports with Ra prefix
2. Create local ref if using hooks
3. Integrate hook or wrap component
4. Update prop handling for React Aria patterns
5. Update types to include React Aria props

**Example - Before (plain div):**

```typescript
export const Component = (props: ComponentProps) => {
  return <div {...props}>{props.children}</div>;
};
```

**Example - After (React Aria integration):**

```typescript
import { useRef } from 'react';
import { Button as RaButton } from 'react-aria-components';
import { useObjectRef } from 'react-aria';
import { mergeRefs } from '@/utils';

export const Component = (props: ComponentProps) => {
  const { ref: forwardedRef, ...rest } = props;

  const localRef = useRef<HTMLButtonElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <ComponentSlot asChild>
      <RaButton {...rest} ref={ref}>
        {props.children}
      </RaButton>
    </ComponentSlot>
  );
};
```

#### Scenario 4: Converting Single to Compound

**Warning**: This is a MAJOR refactor requiring:

- Creating `components/` directory
- Moving implementation to separate part files
- Converting main file to exports only
- Adding Root component with context
- Updating types file with part types
- Updating slots file for multi-slot recipe
- Updating all imports and exports

**Recommendation**: Use `/propose-component` workflow for this significant
change. Manual conversion is error-prone.
