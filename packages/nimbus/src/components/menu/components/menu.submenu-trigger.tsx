import { SubmenuTrigger } from "react-aria-components";
import type { MenuContentProps } from "../menu.types";

export const MenuSubmenuTrigger = ({
  children,
  ...props
}: MenuContentProps) => {
  return <SubmenuTrigger {...props}>{children}</SubmenuTrigger>;
};

MenuSubmenuTrigger.displayName = "MenuSubmenuTrigger";
