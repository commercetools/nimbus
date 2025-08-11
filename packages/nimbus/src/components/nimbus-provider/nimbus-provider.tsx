import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-aria";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

/**
 * # NimbusProvider
 *
 * provides an environment for the rest of the components to work in
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/utilities/nimbusprovider}
 */
export function NimbusProvider({
  children,
  router,
  ...props
}: NimbusProviderProps) {
  // Inner content with all the existing providers
  const content = (
    <ChakraProvider value={system}>
      <NimbusColorModeProvider enableSystem={false} {...props}>
        {children}
      </NimbusColorModeProvider>
    </ChakraProvider>
  );

  // If router config is provided, wrap with RouterProvider for client-side routing
  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  // Default behavior when no router is configured
  return content;
}
