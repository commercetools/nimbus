import { useRef } from "react";
import { ButtonContext, useContextProps } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import type { IconButtonProps } from "./icon-button.types";
import { Button } from "@/components";

/**
 * IconButton
 * ============================================================
 * displays a button with only an icon as child. It is based
 * on the regular `Button` component, but with a few adjustments.
 */
export const IconButton = (props: IconButtonProps) => {
  const { children, ref: forwardedRef, ...restProps } = props;

  // Create a local ref and merge with forwarded ref
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // button context must be passed down as props to button component, or it is lost
  const [buttonContextProps] = useContextProps(restProps, ref, ButtonContext);

  return (
    <Button px={0} py={0} {...buttonContextProps} ref={ref}>
      {children}
    </Button>
  );
};

IconButton.displayName = "IconButton";
