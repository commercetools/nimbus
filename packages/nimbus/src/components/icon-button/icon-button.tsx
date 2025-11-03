import { useRef, useEffect } from "react";
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

  // Runtime accessibility check
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const element = localRef.current;
      if (element) {
        const hasAriaLabel =
          element.hasAttribute("aria-label") ||
          element.hasAttribute("aria-labelledby");

        if (!hasAriaLabel) {
          console.warn(
            "Nimbus: IconButton requires an accessible label. " +
              "Either provide an 'aria-label' prop or use within a component that provides it via context (e.g., slot=\"clear\" in ComboBox).",
            element
          );
        }
      }
    }
  }, [props["aria-label"]]);

  return (
    <Button px={0} py={0} {...restProps} ref={ref}>
      {children}
    </Button>
  );
};

IconButton.displayName = "IconButton";
