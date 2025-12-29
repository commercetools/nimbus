/**
 * FormField Remote DOM Custom Elements
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusFormFieldRoot = createRemoteElement({
  properties: {
    styleProps: true,
    isRequired: true,
    isInvalid: true,
    isDisabled: true,
    isReadOnly: true,
    size: true,
    direction: true,
  },
});

export const NimbusFormFieldLabel = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusFormFieldInput = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusFormFieldDescription = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusFormFieldError = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

// Self-register on import
if (typeof customElements !== "undefined") {
  if (!customElements.get("nimbus-form-field-root")) {
    customElements.define("nimbus-form-field-root", NimbusFormFieldRoot);
  }
  if (!customElements.get("nimbus-form-field-label")) {
    customElements.define("nimbus-form-field-label", NimbusFormFieldLabel);
  }
  if (!customElements.get("nimbus-form-field-input")) {
    customElements.define("nimbus-form-field-input", NimbusFormFieldInput);
  }
  if (!customElements.get("nimbus-form-field-description")) {
    customElements.define(
      "nimbus-form-field-description",
      NimbusFormFieldDescription
    );
  }
  if (!customElements.get("nimbus-form-field-error")) {
    customElements.define("nimbus-form-field-error", NimbusFormFieldError);
  }
}
