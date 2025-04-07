import { useContext, useEffect } from "react";
import { AlertDescription as AlertDescriptionSlot } from "../alert.slots";
import type { AlertDescriptionProps } from "../alert.types";
import { AlertContext } from "./alert.root";

const AlertDescription = ({ children, ...props }: AlertDescriptionProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertDescriptionSlot {...props}>{children}</AlertDescriptionSlot>
      );
      // Register it with the parent
      context.setDescription(slotElement);

      // On unmount, remove it
      return () => context.setDescription(null);
    }
  }, [children, props]);

  return null;
};

AlertDescription.displayName = "Alert.Description";

export default AlertDescription;
