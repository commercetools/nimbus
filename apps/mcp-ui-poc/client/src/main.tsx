import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { NimbusProvider } from "@commercetools/nimbus";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NimbusProvider>
      <App />
    </NimbusProvider>
  </StrictMode>
);
