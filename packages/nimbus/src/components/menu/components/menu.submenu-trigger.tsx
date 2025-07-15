import { memo } from "react";
import {
  SubmenuTrigger as RaSubmenuTrigger,
  type SubmenuTriggerProps,
} from "react-aria-components";

export const MenuSubmenuTrigger = memo(({
  children,
  ...props
}: SubmenuTriggerProps) => {
  return <RaSubmenuTrigger {...props}>{children}</RaSubmenuTrigger>;
});

MenuSubmenuTrigger.displayName = "Menu.SubmenuTrigger";
