import { useState } from "react";
import { IconButton, Tooltip } from "@/components";
import { TextInput } from "@/components/text-input";
import { Visibility, VisibilityOff } from "@commercetools/nimbus-icons";
import type { PasswordInputProps } from "./password-input.types";
import { FormattedMessage, useIntl } from "react-intl";
import messages from "./password-input.i18n";

/**
 * # PasswordInput
 *
 * A password input is a text field that hides entered characters for secure password entry.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/passwordinput}
 */
export const PasswordInput = (props: PasswordInputProps) => {
  const { ref, size = "md", isDisabled } = props;

  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <TextInput
      ref={ref}
      {...props}
      trailingElement={
        <Tooltip.Root>
          <IconButton
            size={size === "md" ? "xs" : "2xs"}
            variant="ghost"
            tone="primary"
            aria-label={
              showPassword
                ? intl.formatMessage(messages.hide)
                : intl.formatMessage(messages.show)
            }
            onPress={toggleVisibility}
            isDisabled={isDisabled}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          <Tooltip.Content>
            <FormattedMessage
              {...(showPassword ? messages.hide : messages.show)}
            />
          </Tooltip.Content>
        </Tooltip.Root>
      }
      type={showPassword ? "text" : "password"}
    />
  );
};

PasswordInput.displayName = "PasswordInput";
