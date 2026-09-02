import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NimbusProvider } from "@commercetools/nimbus";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NimbusProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NimbusProvider>
  </StrictMode>
);
