import { SubmenuTrigger as RaSubmenuTrigger } from "react-aria-components";
import type { MenuSubmenuTriggerProps } from "../menu.types";

/**
 * Menu.SubmenuTrigger - The trigger element for opening a submenu
 *
 * @supportsStyleProps
 */
export const MenuSubmenuTrigger = ({
  children,
  ...props
}: MenuSubmenuTriggerProps) => {
  return <RaSubmenuTrigger {...props}>{children}</RaSubmenuTrigger>;
};

MenuSubmenuTrigger.displayName = "Menu.SubmenuTrigger";
