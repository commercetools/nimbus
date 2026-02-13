import { useRef } from "react";
import { useButton, useObjectRef } from "react-aria";
import { ButtonContext, useContextProps } from "react-aria-components";
import { mergeRefs } from "@chakra-ui/react";
import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

/**
 * # Button
 *
 * Displays a Button.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/button}
 */
const ButtonComponent = (props: ButtonProps) => {
  const { ref: forwardedRef, as, asChild, children, ...rest } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLButtonElement>(null);
  // merge the local ref with a potentially forwarded ref
  const baseRef = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Consume context props based on slot (this enables slot-aware behavior)
  const [contextProps, contextRef] = useContextProps(
    rest,
    baseRef,
    ButtonContext
  );

  // if asChild is set, for react-aria to add the button-role, the elementType
  // has to be manually set to something else than button
  const elementType = as || (asChild ? "a" : "button") || "button";

  // Let useButton process all behavior and accessibility concerns
  const { buttonProps, isPressed } = useButton(
    {
      ...contextProps,
      elementType,
    },
    contextRef
  );

  // Separate React Aria logical props (consumed by useButton) from
  // passthrough props (recipe variants, style props, data-*, className).
  // These logical props are NOT valid DOM attributes and must not be spread.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    onPress: _onPress,
    onPressStart: _onPressStart,
    onPressEnd: _onPressEnd,
    onPressChange: _onPressChange,
    onPressUp: _onPressUp,
    onFocusChange: _onFocusChange,
    isDisabled: _isDisabled,
    preventFocusOnPress: _preventFocusOnPress,
    excludeFromTabOrder: _excludeFromTabOrder,
    slot: _slot,
    ...passthroughProps
  } = contextProps;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <ButtonRoot
      ref={contextRef}
      {...passthroughProps}
      {...buttonProps}
      as={as}
      asChild={asChild}
      slot={contextProps.slot || undefined}
      data-pressed={isPressed || undefined}
    >
      {children}
    </ButtonRoot>
  );
};

// Manually assign a displayName for debugging purposes
ButtonComponent.displayName = "Button";

/**
 * ### Button
 *
 * Displays a Button.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/button}
 */
export const Button: typeof ButtonComponent & {
  // TypeScript can't properly name the internal React Aria types when inferring
  // Button.Context, so we explicitly type it using typeof and Object.assign
  /**
   * ### Button.Context
   *
   * Re-exports React-Aria's `ButtonContext`
   *
   * For advanced use cases, **you generally will not need this**
   *
   * @see {@link https://react-spectrum.adobe.com/react-aria/advanced.html#contexts}
   * @see {@link https://react-spectrum.adobe.com/react-aria/Button.html#contexts}
   */
  Context: typeof ButtonContext;
} = Object.assign(ButtonComponent, {
  Context: ButtonContext,
});
