import { useContext, useEffect } from "react";
import { AlertTitle as AlertTitleSlot } from "../alert.slots";
import type { AlertTitleProps } from "../alert.types";
import { AlertContext } from "./alert.root";

const AlertTitle = ({ children, ...props }: AlertTitleProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertTitleSlot {...props} fontWeight="600">
          {children}
        </AlertTitleSlot>
      );
      // Register it with the parent
      context.setTitle(slotElement);

      // On unmount, remove it
      return () => context.setTitle(null);
    }
  }, [children, props]);

  return null;
};

AlertTitle.displayName = "Alert.Title";

export default AlertTitle;
