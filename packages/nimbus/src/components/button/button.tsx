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

  // Prevent double-firing of wrapped event handlers (onClick, onFocus, onBlur).
  //
  // useButton internally wraps these handlers: usePress wraps onClick via
  // triggerClick, and useFocusable wraps onFocus/onBlur via useFocus.
  // When mergeProps chains both the context handler and the useButton-processed
  // handler, they fire twice for the same native event.
  //
  // Solution: wrap each handler so it deduplicates per native event using a
  // WeakSet. The deduped wrapper is passed to useButton (so the internal
  // wrapping works for keyboard activation, etc.) AND merged into
  // componentProps as a fallback (for cases where usePress can't fire, e.g.
  // when pointerdown is blocked by a parent capture handler).
  //
  // Independent handlers (onKeyDown, onPointerDown, etc.) are NOT wrapped by
  // useButton internals — usePress creates its own separate handlers for those.
  // They chain naturally via mergeProps, which is the correct behavior.
  const handledEventsRef = useRef(new WeakSet<Event>());

  const {
    onClick: contextOnClick,
    onFocus: contextOnFocus,
    onBlur: contextOnBlur,
    onKeyDown: contextOnKeyDown,
    onKeyUp: contextOnKeyUp,
    ...contextPropsWithoutWrapped
  } = contextProps;

  // Generic dedup helper: wraps a handler so it only fires once per native event
  const useDedupedHandler = <T extends (...args: never[]) => void>(
    handler: T | undefined
  ) =>
    useMemo(
      () =>
        handler
          ? (((...args: Parameters<T>) => {
              const e = args[0] as React.SyntheticEvent;
              if (handledEventsRef.current.has(e.nativeEvent)) return;
              handledEventsRef.current.add(e.nativeEvent);
              handler(...args);
            }) as T)
          : undefined,
      [handler]
    );

  const dedupedOnClick = useDedupedHandler(contextOnClick);
  const dedupedOnFocus = useDedupedHandler(contextOnFocus);
  const dedupedOnBlur = useDedupedHandler(contextOnBlur);
  const dedupedOnKeyDown = useDedupedHandler(contextOnKeyDown);
  const dedupedOnKeyUp = useDedupedHandler(contextOnKeyUp);

  const { buttonProps } = useButton(
    {
      ...contextPropsWithoutWrapped,
      onClick: dedupedOnClick,
      onFocus: dedupedOnFocus,
      onBlur: dedupedOnBlur,
      onKeyDown: dedupedOnKeyDown,
      onKeyUp: dedupedOnKeyUp,
      isDisabled,
      elementType,
    },
    contextRef
  );

  const componentProps = mergeProps(contextPropsWithoutWrapped, buttonProps, {
    as,
    asChild,
    onClick: dedupedOnClick,
    onFocus: dedupedOnFocus,
    onBlur: dedupedOnBlur,
    onKeyDown: dedupedOnKeyDown,
    onKeyUp: dedupedOnKeyUp,
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
