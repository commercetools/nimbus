import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { NimbusProvider, useNimbusMessages } from "@commercetools/nimbus";

function Root() {
  const locale = navigator.language || "en";
  const { messages, isLoading } = useNimbusMessages(locale);

  // Wait for messages to load before rendering.
  // The useNimbusMessages hook starts with an empty messages object {} and loads
  // translations asynchronously. If we render components before messages are loaded,
  // components that use translations will show
  // MISSING_TRANSLATION errors in the console.
  if (isLoading) {
    return null;
  }

  return (
    <NimbusProvider locale={locale} messages={messages}>
      <App />
    </NimbusProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
