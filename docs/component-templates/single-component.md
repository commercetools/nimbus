# Single Component Implementation Template

Template for single component implementation. Replace: ComponentName,
component-name, componentName

````tsx
/**
 * Template for single component implementation
 * Replace: ComponentName, component-name, componentName, componentMessagesStrings
 */

import { useRef } from "react";
import { useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";
// Uncomment if using React Aria
// import { ComponentName as RaComponentName } from 'react-aria-components';
import { ComponentNameSlot } from "./component-name.slots";
import type { ComponentNameProps } from "./component-name.types";
// Uncomment if component needs i18n
// import { useLocalizedStringFormatter } from "@/hooks";
// import { {componentName}MessagesStrings } from "./{component-name}.messages";

/**
 * ComponentName
 * ============================================================
 * {DESCRIPTION - Brief description of what this component does}
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 */
export const ComponentName = (props: ComponentNameProps) => {
  const {
    ref: forwardedRef,
    children,
    variant = "primary",
    size = "md",
    // Destructure other props
    ...restProps
  } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Uncomment if using i18n
  // const msg = useLocalizedStringFormatter({componentName}MessagesStrings);
  // const ariaLabel = msg.format("defaultLabel");

  // Component logic here

  return (
    <ComponentNameSlot ref={ref} variant={variant} size={size} {...restProps}>
      {children}
    </ComponentNameSlot>
  );

  // If using React Aria:
  // return (
  //   <ComponentNameSlot asChild variant={variant} size={size}>
  //     <RaComponentName ref={ref} {...restProps}>
  //       {children}
  //     </RaComponentName>
  //   </ComponentNameSlot>
  // );
};

ComponentName.displayName = "ComponentName";
````
