import { forwardRef, useState } from "react";
import { Box, IconButton } from "@/components";
import { TextInput } from "@/components/text-input";
import { Visibility, VisibilityOff } from "@commercetools/nimbus-icons";
import type { PasswordInputProps } from "./password-input.types";

/**
 * PasswordInput
 * ============================================================
 * An input component that takes in password as input with toggleable visibility
 *
 * Features:
 *
 * - Based on TextInput with added password visibility toggle
 * - Allows toggling between type="password" and type="text"
 * - Positions the toggle button at the right edge of the input
 * - Inherits all TextInput features and props
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, forwardedRef) => {
    const { size = "md" } = props;
    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => setShowPassword(!showPassword);

    const iconSize = size === "md" ? "xs" : "2xs";
    const iconPositionProps =
      size === "md"
        ? {
            size: "xs",
            right: "400",
            top: "100",
          }
        : {
            top: "50",
            right: "400",
          };

    return (
      <Box display="inline-block" position="relative">
        <TextInput
          {...props}
          ref={forwardedRef}
          type={showPassword ? "text" : "password"}
          paddingRight="1200"
        />
        <Box position="absolute" {...iconPositionProps}>
          <IconButton
            size={iconSize}
            variant="ghost"
            tone="primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={toggleVisibility}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
      </Box>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
