import { forwardRef, useState } from "react";
import { Box, IconButton, Tooltip, TooltipTrigger } from "@/components";
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
    const { size = "md", isDisabled } = props;
    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => setShowPassword(!showPassword);

    /** size icon based on input size */
    const iconSize = size === "md" ? "xs" : "2xs";
    /**
     * position the icon button at the right edge of the input based on
     * the size of the input
     */
    const iconPositionProps =
      size === "md"
        ? {
            top: "100",
            right: "400",
          }
        : {
            top: "50",
            right: "400",
          };

    /** safe space between the text within the input and the icon button */
    const iconButtonSafeSpace = size === "md" ? "1400" : "1100";

    return (
      <Box display="inline-block" position="relative">
        <TextInput
          width="full"
          ref={forwardedRef}
          type={showPassword ? "text" : "password"}
          {...props}
          pr={iconButtonSafeSpace}
        />
        <Box position="absolute" {...iconPositionProps}>
          <TooltipTrigger>
            <IconButton
              size={iconSize}
              variant="ghost"
              tone="primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={toggleVisibility}
              isDisabled={isDisabled}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            <Tooltip>
              {showPassword ? "Hide password" : "Show Password"}
            </Tooltip>
          </TooltipTrigger>
        </Box>
      </Box>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
