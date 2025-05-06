"use client";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function NimbusProvider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ColorModeProvider enableSystem={false} {...props}>
      <>{children}</>
    </ColorModeProvider>
  );
}
