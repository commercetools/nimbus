import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { NimbusProvider } from "@commercetools/nimbus";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NimbusProvider forcedTheme="dark">
      <App />
    </NimbusProvider>
  </StrictMode>
);
