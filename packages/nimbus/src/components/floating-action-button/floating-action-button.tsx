import { useRef } from "react";
import { useButton, useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { FloatingActionButtonRoot } from "./floating-action-button.slots.tsx";
import type { FloatingActionButtonProps } from "./floating-action-button.types.ts";

const FloatingActionButtonComponent = (props: FloatingActionButtonProps) => {
  const { ref: forwardedRef, children, ...rest } = props;

  const localRef = useRef<HTMLButtonElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const { buttonProps, isPressed } = useButton(rest, ref);

  return (
    <FloatingActionButtonRoot
      ref={ref}
      {...rest}
      {...buttonProps}
      data-pressed={isPressed || undefined}
    >
      {children}
    </FloatingActionButtonRoot>
  );
};

FloatingActionButtonComponent.displayName = "FloatingActionButton";

/**
 * ### FloatingActionButton
 *
 * A circular, icon-only button for prominent actions. Designed as an agent
 * panel trigger or similar high-priority single action.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/floating-action-button}
 */
export const FloatingActionButton: typeof FloatingActionButtonComponent =
  FloatingActionButtonComponent;
