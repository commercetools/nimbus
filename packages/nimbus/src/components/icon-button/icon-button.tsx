import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import type { IconButtonProps } from "./icon-button.types";
import { Button } from "@/components";

/**
 * # IconButton
 * 
 * displays a button with an icon only as child
 * 
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/iconbutton}
 */
export const IconButton = (props: IconButtonProps) => {
  const { children, ref: forwardedRef, ...restProps } = props;

  // Create a local ref and merge with forwarded ref
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <Button px={0} py={0} {...restProps} ref={ref}>
      {children}
    </Button>
  );
};

IconButton.displayName = "IconButton";
