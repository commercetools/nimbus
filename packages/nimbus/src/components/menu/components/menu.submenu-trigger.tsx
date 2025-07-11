import {
  SubmenuTrigger as RaSubmenuTrigger,
  type SubmenuTriggerProps,
} from "react-aria-components";

export const MenuSubmenuTrigger = ({
  children,
  ...props
}: SubmenuTriggerProps) => {
  return <RaSubmenuTrigger {...props}>{children}</RaSubmenuTrigger>;
};

MenuSubmenuTrigger.displayName = "Menu.SubmenuTrigger";
