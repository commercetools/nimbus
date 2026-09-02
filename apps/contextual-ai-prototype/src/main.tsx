import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { NimbusProvider } from "@commercetools/nimbus";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NimbusProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </NimbusProvider>
  </StrictMode>
);
