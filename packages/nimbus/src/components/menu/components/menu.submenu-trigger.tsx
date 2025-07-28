import { SubmenuTrigger as RaSubmenuTrigger } from "react-aria-components";
import type { MenuSubmenuTriggerProps } from "../menu.types";

export const MenuSubmenuTrigger = ({
  children,
  ...props
}: MenuSubmenuTriggerProps) => {
  return <RaSubmenuTrigger {...props}>{children}</RaSubmenuTrigger>;
};

MenuSubmenuTrigger.displayName = "Menu.SubmenuTrigger";
