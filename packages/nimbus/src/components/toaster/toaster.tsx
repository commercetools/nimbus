"use client";

import { Toaster as ChakraToaster } from "@chakra-ui/react";
import { toaster } from "@/hooks/use-toast/toaster";

/**
 * Toaster component that renders toast notifications.
 *
 * This component must be rendered somewhere in your app (typically in your root component)
 * for toast notifications created with `useToast()` to display properly.
 *
 * @example
 * ```tsx
 * import { Toaster } from '@commercetools/nimbus';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   );
 * }
 * ```
 */
export const Toaster = () => {
  return <ChakraToaster toaster={toaster} />;
};

Toaster.displayName = "Toaster";
