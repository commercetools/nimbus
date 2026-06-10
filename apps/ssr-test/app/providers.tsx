"use client";

import { NimbusProvider } from "@commercetools/nimbus";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NimbusProvider locale="en-US" loadFonts={false}>
      {children}
    </NimbusProvider>
  );
}
