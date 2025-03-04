import { forwardRef, useRef } from "react";
import { TextInputRoot } from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";
import { useFocusRing, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";

/**
 * TextInput
 * ============================================================
 * An input component that takes in a text as input
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLInputElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const { isFocused, focusProps } = useFocusRing();

    const stateProps = {
      "data-invalid": props.isInvalid,
      "data-focus": isFocused,
    };

    return (
      <TextInputRoot
        ref={ref}
        {...mergeProps(focusProps, props)}
        {...stateProps}
      />
    );
  }
);
TextInput.displayName = "TextInput";
