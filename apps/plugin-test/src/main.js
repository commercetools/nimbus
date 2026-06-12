// These imports simulate shared code that references nimbus.
// The plugin stubs them so the build succeeds even when nimbus is absent.
import { Button } from "@commercetools/nimbus";
import { NimbusProvider } from "@commercetools/nimbus";
import { nimbusTheme } from "@commercetools/nimbus";

console.log("Button:", Button);
console.log("NimbusProvider:", NimbusProvider);
console.log("nimbusTheme:", nimbusTheme);
