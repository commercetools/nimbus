"use client";

import {
  ChakraProvider,
  // defaultSystem as defaultSystemChakra,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "../../theme";

export function NimbusProvider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider enableSystem={false} {...props}>
        <>{children}</>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
