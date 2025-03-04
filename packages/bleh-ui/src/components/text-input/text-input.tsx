import { forwardRef } from "react";
import { TextInputRoot } from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";

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
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ ...props }, ref) => {
    return <TextInputRoot ref={ref} {...props} />;
  }
);
TextInput.displayName = "TextInput";
