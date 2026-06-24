import { useRef } from "react";
import { useButton, useObjectRef } from "react-aria";
import { ButtonContext, useContextProps } from "react-aria-components";
import { mergeRefs } from "@/utils";
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
  const {
    ref: forwardedRef,
    as,
    asChild,
    children,
    allowFocusWhenDisabled,
    ...rest
  } = props;

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

  // Resolve disabled state from React Aria's `isDisabled` (prop or context),
  // falling back to the deprecated native `disabled`.
  const isDisabled = Boolean(contextProps.isDisabled ?? contextProps.disabled);

  // "Soft disabled": the button is disabled but kept focusable + hoverable so
  // it can host a Tooltip (or other hover/focus affordance). See the
  // `allowFocusWhenDisabled` prop. We achieve this by telling `useButton` the
  // button is *enabled* (so it omits the native `disabled` attribute and stays
  // focusable) while withholding every activation handler, then re-applying
  // `aria-disabled` and suppressing the default action ourselves below.
  const softDisabled = Boolean(isDisabled && allowFocusWhenDisabled);

  // Let useButton process all behavior and accessibility concerns
  const { buttonProps, isPressed } = useButton(
    softDisabled
      ? {
          ...contextProps,
          elementType,
          isDisabled: false,
          // Withhold activation handlers so nothing fires while soft-disabled.
          onPress: undefined,
          onPressStart: undefined,
          onPressEnd: undefined,
          onPressUp: undefined,
          onPressChange: undefined,
          onClick: undefined,
        }
      : {
          ...contextProps,
          elementType,
        },
    contextRef
  );

  // A native button dispatches a click for mouse, touch, and keyboard
  // (Enter/Space) activation, and that click is what triggers form submit/reset
  // and link navigation (`as="a"`). Suppressing it covers every activation path.
  const suppressActivation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <ButtonRoot
      ref={contextRef}
      {...contextProps}
      {...buttonProps}
      {...(softDisabled && {
        "aria-disabled": true,
        onClick: suppressActivation,
      })}
      as={as}
      asChild={asChild}
      slot={contextProps.slot || undefined}
      data-pressed={softDisabled ? undefined : isPressed || undefined}
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
