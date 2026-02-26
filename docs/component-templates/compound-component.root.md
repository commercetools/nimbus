# Compound Component Root Template

Template for compound component root implementation. Replace: ComponentName,
component-name, componentName Location: components/component-name.root.tsx

```tsx
/**
 * Template for compound component root implementation
 * Replace: ComponentName, component-name, componentName, componentMessagesStrings
 * Location: components/component-name.root.tsx
 */

import { useRef } from "react";
import { useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";
// Uncomment if using React Aria
// import { ComponentName as RaComponentName } from 'react-aria-components';
import { ComponentNameRootSlot } from "../component-name.slots";
import type { ComponentNameRootProps } from "../component-name.types";
// Uncomment if using context
// import { ComponentNameProvider } from '../component-name-context';
// Uncomment if component needs i18n
// import { useLocalizedStringFormatter } from "@/hooks";
// import { {componentName}MessagesStrings } from "../{component-name}.messages";

/**
 * Root component that provides configuration and context
 */
export const ComponentNameRoot = (props: ComponentNameRootProps) => {
  const {
    ref: forwardedRef,
    children,
    variant = "primary",
    size = "md",
    // Controlled/uncontrolled props
    value,
    defaultValue,
    onChange,
    // Other props
    ...restProps
  } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // State management for uncontrolled mode
  // const [internalValue, setInternalValue] = useState(defaultValue);
  // const isControlled = value !== undefined;
  // const currentValue = isControlled ? value : internalValue;

  // const handleChange = (newValue: string) => {
  //   if (!isControlled) {
  //     setInternalValue(newValue);
  //   }
  //   onChange?.(newValue);
  // };

  // If using context provider
  // return (
  //   <ComponentNameProvider
  //     value={currentValue}
  //     onChange={handleChange}
  //   >
  //     <ComponentNameRootSlot
  //       ref={ref}
  //       variant={variant}
  //       size={size}
  //       {...restProps}
  //     >
  //       {children}
  //     </ComponentNameRootSlot>
  //   </ComponentNameProvider>
  // );

  // Simple version without context
  return (
    <ComponentNameRootSlot
      ref={ref}
      variant={variant}
      size={size}
      {...restProps}
    >
      {children}
    </ComponentNameRootSlot>
  );
};

ComponentNameRoot.displayName = "ComponentName.Root";
```
