import { useRef, useMemo } from "react";
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

  // Support both `isDisabled` (React Aria) and `disabled` (HTML) prop names.
  // Components like CollapsibleMotion.Trigger pass `disabled` via asChild.
  const isDisabled = contextProps.isDisabled ?? contextProps.disabled;

  // Prevent double-firing of onClick while ensuring it fires even when a
  // parent blocks pointerdown (e.g., DataTable row capture handlers).
  //
  // usePress (inside useButton) wraps onClick via triggerClick. When
  // mergeProps chains both contextProps.onClick and buttonProps.onClick,
  // onClick fires twice. Simply filtering contextProps.onClick breaks when
  // pointerdown is blocked because usePress never starts a press sequence
  // and triggerClick is never called.
  //
  // Solution: wrap onClick so it deduplicates per native event. The same
  // wrapper is passed to useButton (for keyboard support via triggerClick /
  // triggerSyntheticClick) AND merged into componentProps as a fallback.
  // The first invocation per native event fires; subsequent calls (from
  // mergeProps chaining) are no-ops.
  const handledClicksRef = useRef(new WeakSet<Event>());
  const { onClick: contextOnClick, ...contextPropsWithoutOnClick } =
    contextProps;

  /** How it works:                                                                                                                                         
  - dedupedOnClick wraps the original onClick with a WeakSet check on e.nativeEvent                                                                     
  - It's passed to useButton → usePress uses it for triggerClick (pointer) and triggerSyntheticClick (keyboard)                                         
  - It's also in componentProps as a fallback (via the third mergeProps arg)
  - Normal click: usePress calls triggerClick → dedupedOnClick fires, adds to WeakSet → mergeProps chain calls it again → already in WeakSet, skips
  - Blocked pointerdown: usePress doesn't call triggerClick → mergeProps chain calls dedupedOnClick → not in WeakSet, fires
  - Keyboard: triggerSyntheticClick creates a new MouseEvent → dedupedOnClick fires → no native click event → no second call */
  const dedupedOnClick = useMemo(
    () =>
      contextOnClick
        ? (...args: Parameters<typeof contextOnClick>) => {
            const e = args[0];
            if (handledClicksRef.current.has(e.nativeEvent)) return;
            handledClicksRef.current.add(e.nativeEvent);
            contextOnClick(...args);
          }
        : undefined,
    [contextOnClick]
  );

  const { buttonProps } = useButton(
    {
      ...contextPropsWithoutOnClick,
      onClick: dedupedOnClick,
      isDisabled,
      elementType,
    },
    contextRef
  );

  // Strip props from contextProps that useButton already returns in buttonProps
  // to prevent double-firing of event handlers (onKeyDown, etc.)
  // while preserving non-standard props (Chakra style props, etc.) that
  // useButton's filterDOMProps strips out.
  const passthroughContextProps = Object.fromEntries(
    Object.entries(contextPropsWithoutOnClick).filter(
      ([key]) => !(key in buttonProps)
    )
  );

  const componentProps = mergeProps(passthroughContextProps, buttonProps, {
    as,
    asChild,
    onClick: dedupedOnClick,
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
      {...componentProps}
      aria-disabled={isDisabled || undefined}
      data-disabled={isDisabled || undefined}
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
