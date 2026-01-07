import { useState } from "react";
import { IconButton, Tooltip } from "@/components";
import { TextInput } from "@/components/text-input/text-input";
import { Visibility, VisibilityOff } from "@commercetools/nimbus-icons";
import type { PasswordInputProps } from "./password-input.types";
import { useLocale } from "react-aria-components";
import { passwordInputMessages } from "./password-input.messages";

/**
 * # PasswordInput
 *
 * A password input is a text field that hides entered characters for secure password entry.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/passwordinput}
 */
export const PasswordInput = (props: PasswordInputProps) => {
  const { ref, size = "md", isDisabled } = props;

  const { locale } = useLocale();
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  const currentLabel = passwordInputMessages.getVariableLocale(
    showPassword ? "hide" : "show",
    locale
  );

  return (
    <TextInput
      ref={ref}
      {...props}
      trailingElement={
        <Tooltip.Root>
          <IconButton
            size={size === "md" ? "xs" : "2xs"}
            variant="ghost"
            colorPalette="primary"
            aria-label={currentLabel}
            onPress={toggleVisibility}
            isDisabled={isDisabled}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          <Tooltip.Content>{currentLabel}</Tooltip.Content>
        </Tooltip.Root>
      }
      type={showPassword ? "text" : "password"}
    />
  );
};

PasswordInput.displayName = "PasswordInput";
