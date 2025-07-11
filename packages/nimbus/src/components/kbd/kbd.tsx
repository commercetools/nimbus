import { KeyboardContext, useContextProps } from "react-aria-components";
import {
  Kbd as ChakraKbd,
  mergeRefs,
  type KbdProps as ChakraKbdProps,
} from "@chakra-ui/react";
import { useRef } from "react";
import type React from "react";
import { useObjectRef } from "react-aria";

/**
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export interface KbdProps extends Omit<ChakraKbdProps, "slot"> {
  ref?: React.Ref<HTMLElement>;
  slot?: string | null | undefined;
}

export const Kbd = ({ ref: forwardedRef, slot, ...props }: KbdProps) => {
  const localRef = useRef<HTMLElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const [rest] = useContextProps(props, ref, KeyboardContext);

  return <ChakraKbd ref={ref} slot={slot || undefined} {...rest} />;
};
