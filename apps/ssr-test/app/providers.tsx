"use client";

import { NimbusProvider } from "@commercetools/nimbus";
import { EmotionRegistry } from "./emotion-registry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <NimbusProvider locale="en-US" loadFonts={false}>
        {children}
      </NimbusProvider>
    </EmotionRegistry>
  );
}
