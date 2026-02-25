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
  const {
    children,
    ref: forwardedRef,
    "aria-label": ariaLabel,
    ...restProps
  } = props;

  // Create a local ref and merge with forwarded ref
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Runtime accessibility check
  // Use setTimeout to defer check until after React Aria applies context props
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const timeoutId = setTimeout(() => {
        const element = localRef.current;
        if (element) {
          const hasAriaLabel =
            element.hasAttribute("aria-label") ||
            element.hasAttribute("aria-labelledby");

          // Skip warning if component is using slot-based context (Button will handle it)
          const isUsingSlot = element.hasAttribute("slot");

          if (!hasAriaLabel && !isUsingSlot) {
            console.warn(
              "Nimbus: IconButton requires an accessible label. " +
                "Either provide an 'aria-label' prop or use within a component that provides it via context (e.g., slot=\"clear\" in ComboBox).",
              element
            );
          }
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [ariaLabel, restProps.slot]);

  return (
    <Button px={0} py={0} aria-label={ariaLabel} {...restProps} ref={ref}>
      {children}
    </Button>
  );
};

IconButton.displayName = "IconButton";
