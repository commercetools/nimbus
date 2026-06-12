/* eslint-disable no-undef -- Node script, not browser code */
// Minimal entry point for the webpack build.
// Proves the UNSAFE_nimbusOptionalDependency plugin is a no-op when nimbus IS
// installed — the build succeeds and real nimbus exports are preserved.
import { Button } from "@commercetools/nimbus";
import { NimbusProvider } from "@commercetools/nimbus";
import { useColorMode } from "@commercetools/nimbus";

console.log("Button:", Button);
console.log("NimbusProvider:", NimbusProvider);
console.log("useColorMode:", useColorMode);
