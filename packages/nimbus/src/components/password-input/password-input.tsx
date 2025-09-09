import { forwardRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@/components";
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
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, forwardedRef) => {
    const { size = "md", isDisabled, leadingElement, ...restProps } = props;
    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => setShowPassword(!showPassword);
    const intl = useIntl();
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
            top: "150",
            right: "400",
          };

    /** safe space between the text within the input and the icon button */
    const iconButtonSafeSpace = size === "md" ? "1400" : "1100";

    return (
      <Box display="inline-block" position="relative">
        <TextInput
          width="full"
          ref={forwardedRef}
          leadingElement={leadingElement}
          type={showPassword ? "text" : "password"}
          {...restProps}
          size={size}
          pr={iconButtonSafeSpace}
          gap={size === "md" ? "200" : "100"}
        />
        <Box position="absolute" {...iconPositionProps}>
          <Tooltip.Root>
            <IconButton
              size={iconSize}
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
        </Box>
      </Box>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
