import { createContext, useContext } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { dialogSlotRecipe } from "../dialog.recipe";

/**
 * Context value containing dialog configuration passed from Root to child components
 */
export interface DialogContextValue
  extends RecipeVariantProps<typeof dialogSlotRecipe> {
  // Add any additional context values here if needed in the future
}

export const DialogContext = createContext<DialogContextValue | undefined>(
  undefined
);

/**
 * Hook to access dialog configuration from DialogContext
 * @returns Dialog configuration from context
 * @throws Error if used outside of Dialog.Root
 */
export const useDialogContext = (): DialogContextValue => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within Dialog.Root");
  }
  return context;
};

/**
 * Provider component that passes dialog configuration down to child components
 */
export const DialogProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DialogContextValue;
}) => {
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};
