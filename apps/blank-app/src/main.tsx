import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { NimbusProvider } from "@commercetools/nimbus";

function Root() {
  const locale = navigator.language || "en";

  return (
    <NimbusProvider locale={locale}>
      <App />
    </NimbusProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
