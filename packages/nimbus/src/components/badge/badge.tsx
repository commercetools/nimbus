import { useRef } from "react";
import { BadgeRoot } from "./badge.slots";
import type { BadgeProps } from "./badge.types";
import { mergeRefs } from "@chakra-ui/react";
import { useObjectRef, mergeProps } from "react-aria";
/**
 * # Badge
 * 
 * Briefly highlights or categorizes associated UI elements with concise visual cues for status or metadata.
 * 
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/badge}
 */

export const Badge = (props: BadgeProps) => {
  const { ref: forwardedRef, as, children, ...rest } = props;

  const localRef = useRef<HTMLSpanElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const elementType = as || "span";

  return (
    <BadgeRoot as={elementType} {...mergeProps(rest, { ref })}>
      {children}
    </BadgeRoot>
  );
};

Badge.displayName = "Badge";
