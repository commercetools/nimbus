import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { NimbusProvider } from "@commercetools/nimbus";
import { App } from "./App";

// StrictMode removed: it double-fires effects which breaks the
// progressive chat animation timers. This is a demo prototype.
createRoot(document.getElementById("root")!).render(
  <NimbusProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </NimbusProvider>
);
