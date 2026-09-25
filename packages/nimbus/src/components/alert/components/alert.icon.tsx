import { AlertIcon as AlertIconSlot } from "../alert.slots";
import type { AlertIconProps } from "../alert.types";

/**
 * Alert.Icon - Replaces the automatic status icon.
 *
 * @supportsStyleProps
 */
export const AlertIcon = ({ children, ...props }: AlertIconProps) => {
  return <AlertIconSlot {...props}>{children}</AlertIconSlot>;
};

AlertIcon.displayName = "Alert.Icon";
