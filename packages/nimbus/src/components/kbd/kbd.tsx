import { KeyboardContext, useContextProps } from "react-aria-components";
import { mergeRefs, type KbdProps as ChakraKbdProps } from "@chakra-ui/react";
import { useRef } from "react";
import type React from "react";
import { useObjectRef } from "react-aria";
import { KbdRootSlot } from "./kbd.slots";

export interface KbdProps extends Omit<ChakraKbdProps, "slot"> {
  ref?: React.Ref<HTMLElement>;
  slot?: string | null | undefined;
}

/**
 * # Kbd
 * 
 * Renders a keyboard shortcut or key combination, styled for visual clarity.
 * Typically used to visually represent keyboard keys.
 * 
 * @see {@link https://nimbus-documentation.vercel.app/components/typography/kbd}
 */
export const Kbd = ({ ref: forwardedRef, slot, ...props }: KbdProps) => {
  const localRef = useRef<HTMLElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const [rest] = useContextProps(props, ref, KeyboardContext);

  return <KbdRootSlot ref={ref} slot={slot || undefined} {...rest} />;
};
