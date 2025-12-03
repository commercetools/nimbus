import { createContext, useContext } from "react";
import type { DrawerRootProps } from "../drawer.types";

/**
 * Context value containing drawer configuration passed from Root to child components
 */
export type DrawerContextValue = DrawerRootProps & {
  /**
   * Internal flag indicating whether the drawer has a Drawer.Trigger component.
   * Used by DrawerContent to determine whether DialogTrigger is managing state.
   */
  hasDrawerTrigger?: boolean;
};

export const DrawerContext = createContext<DrawerContextValue | undefined>(
  undefined
);

/**
 * Hook to access drawer configuration from DrawerContext
 * @returns Drawer configuration from context
 * @throws Error if used outside of Drawer.Root
 */
export const useDrawerRootContext = (): DrawerContextValue => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within Drawer.Root");
  }
  return context;
};

/**
 * Provider component that passes drawer configuration down to child components
 */
export const DrawerProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DrawerContextValue;
}) => {
  return <DrawerContext value={value}>{children}</DrawerContext>;
};
