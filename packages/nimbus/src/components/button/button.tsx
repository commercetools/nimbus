import { useRef } from "react";
import { useButton, useObjectRef, mergeProps } from "react-aria";
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

  const { buttonProps } = useButton(
    {
      ...contextProps,
      elementType,
    },
    contextRef
  );

  const componentProps = mergeProps(buttonProps, {
    as,
    asChild,
    /**
     * In case `slot` was null, the `useContextProps` hook already
     * processed it at this point, so it's safe to not attach it
     * to the DOM element
     */
    slot: contextProps.slot || undefined,
  });

  return (
    <ButtonRoot
      ref={contextRef}
      {...contextProps}
      {...componentProps}
      aria-disabled={contextProps.isDisabled || undefined}
      data-disabled={contextProps.isDisabled || undefined}
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
