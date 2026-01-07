/**
 * TextInput Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusTextInput = createRemoteElement({
  properties: {
    styleProps: true,
    name: true,
    placeholder: true,
    type: true,
    value: true,
    defaultValue: true,
    isRequired: true,
    isDisabled: true,
    isReadOnly: true,
    minLength: true,
    maxLength: true,
    pattern: true,
    min: true,
    max: true,
    step: true,
    accept: true,
    multiple: true,
    autoComplete: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-text-input")
) {
  customElements.define("nimbus-text-input", NimbusTextInput);
}
