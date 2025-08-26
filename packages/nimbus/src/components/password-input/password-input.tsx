import { forwardRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@/components";
import { TextInput } from "@/components/text-input";
import { Visibility, VisibilityOff } from "@commercetools/nimbus-icons";
import type { PasswordInputProps } from "./password-input.types";

/**
 * # PasswordInput
 *
 * A password input is a text field that hides entered characters for secure password entry.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/passwordinput}
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, forwardedRef) => {
    const { size = "md", isDisabled, leadingElement, ...restProps } = props;
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
        {leadingElement && (
          <Box position="absolute" left={400} top={size === "md" ? 200 : 150}>
            {leadingElement}
          </Box>
        )}
        <TextInput
          width="full"
          ref={forwardedRef}
          type={showPassword ? "text" : "password"}
          {...restProps}
          pr={iconButtonSafeSpace}
          pl={leadingElement ? "1000" : undefined}
        />
        <Box position="absolute" {...iconPositionProps}>
          <Tooltip.Root>
            <IconButton
              size={iconSize}
              variant="ghost"
              tone="primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onPress={toggleVisibility}
              isDisabled={isDisabled}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            <Tooltip.Content>
              {showPassword ? "Hide password" : "Show Password"}
            </Tooltip.Content>
          </Tooltip.Root>
        </Box>
      </Box>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
