/**
 * Nimbus DataTable Remote DOM Custom Element
 */

import {
  RemoteElement,
  RemoteElementConstructor,
} from "@remote-dom/core/elements";

/**
 * DataTable custom element
 * Properties need to be explicitly defined for Remote DOM serialization
 */
export class NimbusDataTable extends RemoteElement {
  // Define properties that should be transmitted through Remote DOM
  static get remoteProperties() {
    return {
      // Complex properties sent as JSON strings
      columns: String,
      rows: String,

      // Standard props
      allowsSorting: Boolean,
      isRowClickable: Boolean,
      density: String,
      width: String,
      "aria-label": String,

      // StyleProps object
      styleProps: Object,
    };
  }
}

// Register the custom element
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-data-table")
) {
  customElements.define(
    "nimbus-data-table",
    NimbusDataTable as RemoteElementConstructor
  );
}
