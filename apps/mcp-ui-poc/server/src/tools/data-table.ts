import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { commonStyleSchema } from "../utils/common-schemas.js";
import { createElementFromDefinition } from "../utils/create-element-from-definition.js";
import {
  getRemoteEnvironment,
  flushAllEnvironments,
} from "../remote-dom/environment.js";
import { handleButtonClick } from "./button.js";
import { queueAction } from "../utils/action-queue.js";
import { showToast } from "../utils/toaster.js";

export interface ColumnDef {
  key: string;
  label: string;
}

export interface DataTableArgs {
  title?: string;
  columns: ColumnDef[];
  rows: Record<string, unknown>[];
  ariaLabel: string;
  showDetails?: boolean;
  editAction?: { instruction: string };
}

// Store full row data by URI for details view
const rowDataByUri = new Map<string, Record<string, unknown>[]>();

// Store edit mode state by URI
const editModeByUri = new Map<
  string,
  { isEditMode: boolean; currentRowId: string | null }
>();

// Store edit instruction by URI (for save action)
const editInstructionByUri = new Map<string, string>();

// Store direct reference to flex container element by URI
// This is needed because when data tables are created via createElementFromDefinition,
// the elements are in the parent's environment, not the data table's own URI environment
const flexContainerByUri = new Map<string, Element>();

/**
 * Get the flex container element for a URI
 * Checks the direct reference map first, then falls back to environment lookup
 */
function getFlexContainer(uri: string): Element | null {
  // First check direct reference (for nested data tables created via createElementFromDefinition)
  const directRef = flexContainerByUri.get(uri);
  if (directRef) return directRef;

  // Fall back to environment lookup (for data tables created via createDataTable tool)
  const env = getRemoteEnvironment(uri);
  const root = env.getRoot() as Element;
  return root.firstChild as Element | null;
}

/**
 * Flush mutations - handles both direct and nested data tables
 * For nested data tables (created via createElementFromDefinition), elements are
 * attached to the parent's environment, not the data table's own URI environment.
 * So we flush all environments to ensure mutations are sent.
 */
function flushMutations() {
  // Flush all environments because nested data tables may be attached to
  // a different environment (the parent's) than their own URI
  flushAllEnvironments();
}

/**
 * Handle drawer close events - set isOpen to false
 */
export function handleDrawerClose(uri: string) {
  const flexContainer = getFlexContainer(uri);
  if (!flexContainer) return;

  const drawer = flexContainer.querySelector(
    "#details-drawer"
  ) as RemoteDomElement | null;
  if (!drawer) return;

  drawer.isOpen = false;
  flushMutations();
}

/**
 * Handle toggle edit mode button click
 */
export function handleToggleEditMode(uri: string) {
  const editState = editModeByUri.get(uri);
  if (!editState) return;

  editState.isEditMode = !editState.isEditMode;

  if (editState.currentRowId) {
    const allData = rowDataByUri.get(uri);
    const rowData = allData?.find((row) => row.id === editState.currentRowId);
    if (rowData) {
      renderDrawerContent(uri, rowData, editState.isEditMode);
    }
  }
}

/**
 * Handle save changes from edit mode
 * Returns true if save was initiated, false if validation failed
 */
export function handleSaveChanges(
  uri: string,
  formData: Record<string, string>
): boolean {
  const editState = editModeByUri.get(uri);
  if (!editState || !editState.currentRowId) return false;

  const allData = rowDataByUri.get(uri);
  if (!allData) return false;

  const rowIndex = allData.findIndex(
    (row) => row.id === editState.currentRowId
  );
  if (rowIndex === -1) return false;

  const currentRow = allData[rowIndex];

  const instructionTemplate = editInstructionByUri.get(uri);

  if (!instructionTemplate) {
    showToast({
      type: "error",
      title: "Cannot Save",
      message: "No edit instruction configured for this table",
    });
    return false;
  }

  // Build instruction by substituting placeholders
  const instruction =
    instructionTemplate
      .replace("{id}", String(currentRow.id))
      .replace("{formData}", JSON.stringify(formData, null, 2)) +
    "\n\nCRITICAL: Execute ONLY the commerce tool specified above. Do NOT call any ui__ tools. Do NOT create data tables, cards, or any other UI components. Just execute the commerce tool and report success or failure.";

  queueAction(
    {
      type: "mcp-tool-call",
      toolName: "claude-instruction", // Special marker for instruction-based actions
      params: {
        instruction,
        entityId: currentRow.id,
        formData,
      },
      uri,
    },
    (result, error) => {
      if (error) {
        // Revert to view mode with ORIGINAL data
        const allData = rowDataByUri.get(uri);
        if (!allData) return;

        const rowIndex = allData.findIndex(
          (row) => row.id === editState.currentRowId
        );
        if (rowIndex === -1) return;

        const originalRow = allData[rowIndex];
        editState.isEditMode = false;
        renderDrawerContent(uri, originalRow, false);

        // Show error toast
        const errorMsg =
          typeof error === "object" && error !== null
            ? (error as { message?: string }).message || "Unknown error"
            : String(error);

        showToast({
          type: "error",
          title: "Failed to Save",
          message: errorMsg,
        });

        return;
      }

      // Update local data - merge formData since we know save succeeded
      // We can't reliably extract updated entity from Claude's text response,
      // so we optimistically apply the formData changes
      const allData = rowDataByUri.get(uri);
      if (!allData) return;

      const rowIndex = allData.findIndex(
        (row) => row.id === editState.currentRowId
      );
      if (rowIndex === -1) return;

      // Apply the form data changes (optimistic update)
      const updatedRow = { ...allData[rowIndex], ...formData };
      allData[rowIndex] = updatedRow;

      // Update the data table with new data
      updateDataTable(uri, allData);

      // Switch back to view mode and show updated data
      editState.isEditMode = false;
      renderDrawerContent(uri, updatedRow, false);

      // Show success toast
      showToast({
        type: "success",
        title: "Saved Successfully",
        message: "Changes have been saved",
      });
    }
  );

  return true;
}

/**
 * Handle row click events - dynamically populate details with ALL row data
 */
export function handleDataTableRowClick(uri: string, rowId: string) {
  const allData = rowDataByUri.get(uri);
  if (!allData) return;

  const rowData = allData.find((row) => row.id === rowId);
  if (!rowData) return;

  if (!editModeByUri.has(uri)) {
    editModeByUri.set(uri, { isEditMode: false, currentRowId: null });
  }

  const editState = editModeByUri.get(uri)!;
  editState.currentRowId = String(rowData.id);
  editState.isEditMode = false;

  updateDetailsDrawer(uri, rowData);
}

/**
 * Update the data table with new row data
 */
function updateDataTable(uri: string, updatedData: Record<string, unknown>[]) {
  const flexContainer = getFlexContainer(uri);
  if (!flexContainer) return;

  const dataTable = flexContainer.querySelector(
    "nimbus-data-table"
  ) as RemoteDomElement | null;

  if (!dataTable) return;

  dataTable.rows = JSON.stringify(updatedData);
  flushMutations();
}

/**
 * Render drawer content in either view or edit mode
 */
function renderDrawerContent(
  uri: string,
  rowData: Record<string, unknown>,
  isEditMode: boolean
) {
  const flexContainer = getFlexContainer(uri);
  if (!flexContainer) return;

  const detailsContent = flexContainer.querySelector(
    "#details-content"
  ) as Element | null;

  if (!detailsContent) return;

  // Update toggle button text based on mode
  const toggleButton = flexContainer.querySelector(
    "#edit-toggle"
  ) as RemoteDomElement | null;
  if (toggleButton) {
    // Clear and update button text
    while (toggleButton.firstChild) {
      toggleButton.removeChild(toggleButton.firstChild);
    }
    const buttonText = document.createTextNode(isEditMode ? "View" : "Edit");
    toggleButton.appendChild(buttonText);
  }

  // Clear existing content
  while (detailsContent.firstChild) {
    detailsContent.removeChild(detailsContent.firstChild);
  }

  if (isEditMode) {
    // Edit mode: Create form with inputs
    const formStack = document.createElement(
      "nimbus-stack"
    ) as RemoteDomElement;
    formStack.as = "form";
    formStack.direction = "column";
    formStack.styleProps = { gap: "400" };

    // Create form fields for each property
    Object.entries(rowData).forEach(([key, value]) => {
      if (key === "id") return; // Skip internal ID

      // Check if this is an image URL field - show as read-only in edit mode
      const isImageField =
        /^(image|imageUrl|img|photo|picture|thumbnail)$/i.test(key);
      const valueStr = String(value);
      const looksLikeUrl =
        valueStr.startsWith("http://") || valueStr.startsWith("https://");

      if (isImageField && looksLikeUrl) {
        const imageElement = document.createElement(
          "nimbus-image"
        ) as RemoteDomElement;
        imageElement.src = valueStr;
        imageElement.alt = `${key} for ${rowData.name || "item"}`;
        imageElement.styleProps = {
          borderRadius: "200",
          maxWidth: "100%",
          width: "100%",
          marginBottom: "400",
        };
        formStack.appendChild(imageElement);
        return;
      }

      // Form field with label and input
      const formFieldRoot = document.createElement(
        "nimbus-form-field-root"
      ) as RemoteDomElement;

      const formFieldLabel = document.createElement(
        "nimbus-form-field-label"
      ) as RemoteDomElement;
      formFieldLabel.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      formFieldRoot.appendChild(formFieldLabel);

      const formFieldInput = document.createElement(
        "nimbus-form-field-input"
      ) as RemoteDomElement;

      const textInput = document.createElement(
        "nimbus-text-input"
      ) as RemoteDomElement;
      textInput.name = key;
      textInput.defaultValue = valueStr;
      formFieldInput.appendChild(textInput);

      formFieldRoot.appendChild(formFieldInput);
      formStack.appendChild(formFieldRoot);
    });

    // Add Save button (always present in edit mode - errors handled by save handler)
    const saveButton = document.createElement(
      "nimbus-button"
    ) as RemoteDomElement;
    saveButton.setAttribute("id", "save-changes-button");
    saveButton["data-uri"] = uri; // Use correct URI for button events (property, not attribute - Remote DOM only tracks properties)
    saveButton.variant = "solid";
    saveButton.styleProps = { marginTop: "400" };
    const saveButtonText = document.createTextNode("Save Changes");
    saveButton.appendChild(saveButtonText);

    formStack.appendChild(saveButton);
    detailsContent.appendChild(formStack);
  } else {
    // View mode: Show read-only text
    const stack = document.createElement("nimbus-stack") as RemoteDomElement;
    stack.direction = "column";
    stack.styleProps = { gap: "300" };

    // Dynamically create fields for each property in row data
    Object.entries(rowData).forEach(([key, value]) => {
      if (key === "id") return; // Skip internal ID

      // Check if this is an image URL field
      const isImageField =
        /^(image|imageUrl|img|photo|picture|thumbnail)$/i.test(key);
      const valueStr = String(value);
      const looksLikeUrl =
        valueStr.startsWith("http://") || valueStr.startsWith("https://");

      // If it's an image field with a URL, render as image
      if (isImageField && looksLikeUrl) {
        const imageElement = document.createElement(
          "nimbus-image"
        ) as RemoteDomElement;
        imageElement.src = valueStr;
        imageElement.alt = `${key} for ${rowData.name || "item"}`;
        imageElement.styleProps = {
          borderRadius: "200",
          maxWidth: "100%",
          width: "100%",
          marginBottom: "400",
        };
        stack.appendChild(imageElement);
        return; // Skip text rendering for images
      }

      // Regular field - render as label + value
      const fieldStack = document.createElement(
        "nimbus-stack"
      ) as RemoteDomElement;
      fieldStack.direction = "column";
      fieldStack.styleProps = { gap: "100" };

      // Label
      const label = document.createElement("nimbus-text") as RemoteDomElement;
      label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      label.styleProps = {
        fontWeight: "bold",
        fontSize: "sm",
        color: "neutral.11",
      };
      fieldStack.appendChild(label);

      // Value
      const valueText = document.createElement(
        "nimbus-text"
      ) as RemoteDomElement;
      valueText.textContent = valueStr;
      fieldStack.appendChild(valueText);

      stack.appendChild(fieldStack);
    });

    detailsContent.appendChild(stack);
  }

  flushMutations();
}

/**
 * Dynamically update drawer with row data and open it
 */
function updateDetailsDrawer(uri: string, rowData: Record<string, unknown>) {
  const flexContainer = getFlexContainer(uri);
  if (!flexContainer) return;

  const drawer = flexContainer.querySelector(
    "#details-drawer"
  ) as RemoteDomElement | null;
  if (!drawer) return;

  drawer.isOpen = true;
  flushMutations();

  renderDrawerContent(uri, rowData, false);
}

/**
 * Internal interface for creating data table elements
 * Used by both createDataTable tool and createElementFromDefinition
 */
export interface CreateDataTableElementArgs {
  title?: string;
  columns: Array<{
    key?: string;
    label?: string;
    id?: string;
    header?: string;
  }>;
  rows: Record<string, unknown>[];
  ariaLabel: string;
  showDetails?: boolean;
  editAction?: { instruction: string };
  /** Pre-generated URI for storing row data (used when created as nested element) */
  uri?: string;
}

/**
 * Creates the data table element structure (without resource wrapper)
 * Can be used standalone or as part of createDataTable tool
 */
export function createDataTableElement(args: CreateDataTableElementArgs): {
  element: RemoteDomElement;
  uri: string;
  dataTableRows: Record<string, unknown>[];
} {
  const {
    title,
    columns,
    rows,
    ariaLabel,
    showDetails = false,
    editAction,
    uri: providedUri,
  } = args;

  // Transform column definitions to DataTable format
  // Handle both {key, label} and {id, header} formats
  const dataTableColumns = columns.map((col) => ({
    id: col.key || col.id || "",
    header: col.label || col.header || col.key || col.id || "",
    accessor: `(row) => row['${col.key || col.id}']`,
  }));

  // Transform rows to include id field and preserve ALL original data
  // If row has no id, use index as fallback
  const dataTableRows = rows.map((row, idx) => ({
    ...row,
    id: row.id !== undefined && row.id !== null ? String(row.id) : `row-${idx}`,
  }));

  // Generate URI for storing row data
  const uri = providedUri || `ui://data-table/${Date.now()}`;

  // Create the simple data table element first
  const dataTableElement = document.createElement(
    "nimbus-data-table"
  ) as RemoteDomElement;
  dataTableElement.columns = JSON.stringify(dataTableColumns);
  dataTableElement.rows = JSON.stringify(dataTableRows);
  dataTableElement.allowsSorting = true;
  dataTableElement.isRowClickable = showDetails;
  dataTableElement.density = "default";
  dataTableElement.width = "100%";
  dataTableElement["aria-label"] = ariaLabel;

  // When showDetails is enabled, store the URI on the data table element
  // This allows the client to use the correct URI for row click events
  // (necessary when the data table is nested inside another component like Stack)
  // Use property assignment, not setAttribute - Remote DOM only tracks properties
  if (showDetails) {
    dataTableElement["data-uri"] = uri;
  }

  if (!showDetails) {
    // No details mode - just return the data table element
    return { element: dataTableElement, uri, dataTableRows };
  }

  // Details mode - create flex container with table and drawer
  const rootElement = document.createElement("nimbus-flex") as RemoteDomElement;
  rootElement.direction = "column";
  rootElement.styleProps = { gap: "600", width: "100%" };

  // Add title if provided
  if (title) {
    const heading = document.createElement(
      "nimbus-heading"
    ) as RemoteDomElement;
    heading.size = "xl";
    heading.textContent = title;
    rootElement.appendChild(heading);
  }

  rootElement.appendChild(dataTableElement);

  // Create drawer infrastructure
  const drawerRoot = document.createElement(
    "nimbus-drawer-root"
  ) as RemoteDomElement;
  drawerRoot.setAttribute("id", "details-drawer");
  drawerRoot.isOpen = false;
  drawerRoot.isDismissable = true;
  // Store the data table's URI on the drawer so client can use correct URI for events
  // Use property assignment, not setAttribute - Remote DOM only tracks properties
  drawerRoot["data-uri"] = uri;

  // Hidden trigger
  const drawerTrigger = document.createElement(
    "nimbus-drawer-trigger"
  ) as RemoteDomElement;
  drawerTrigger.styleProps = { display: "none" };
  const triggerText = document.createElement("nimbus-text") as RemoteDomElement;
  triggerText.textContent = "Open Details";
  drawerTrigger.appendChild(triggerText);
  drawerRoot.appendChild(drawerTrigger);

  // Drawer content
  const drawerContent = document.createElement(
    "nimbus-drawer-content"
  ) as RemoteDomElement;
  drawerContent.size = "md";
  drawerContent.placement = "end";

  // Drawer header
  const drawerHeader = document.createElement(
    "nimbus-drawer-header"
  ) as RemoteDomElement;
  drawerHeader.styleProps = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: "800",
  };

  const drawerTitle = document.createElement(
    "nimbus-drawer-title"
  ) as RemoteDomElement;
  drawerTitle.textContent = "Details";
  drawerHeader.appendChild(drawerTitle);

  // Header actions
  const headerActions = document.createElement(
    "nimbus-flex"
  ) as RemoteDomElement;
  headerActions.direction = "row";
  headerActions.styleProps = { gap: "200", alignItems: "center" };

  const editToggle = document.createElement(
    "nimbus-button"
  ) as RemoteDomElement;
  editToggle.setAttribute("id", "edit-toggle");
  editToggle["data-uri"] = uri; // Use correct URI for button events (property, not setAttribute - Remote DOM only tracks properties)
  editToggle.variant = "ghost";
  editToggle.size = "sm";
  editToggle.appendChild(document.createTextNode("Edit"));
  headerActions.appendChild(editToggle);

  const drawerClose = document.createElement(
    "nimbus-drawer-close-trigger"
  ) as RemoteDomElement;
  drawerClose.setAttribute("aria-label", "Close drawer");
  drawerClose["data-uri"] = uri; // Use correct URI for close events (property, not setAttribute - Remote DOM only tracks properties)
  headerActions.appendChild(drawerClose);

  drawerHeader.appendChild(headerActions);
  drawerContent.appendChild(drawerHeader);

  // Drawer body
  const drawerBody = document.createElement(
    "nimbus-drawer-body"
  ) as RemoteDomElement;
  drawerBody.setAttribute("id", "details-content");

  const placeholder = document.createElement("nimbus-text") as RemoteDomElement;
  placeholder.textContent = "Click a row to view details";
  placeholder.styleProps = { color: "neutral.11" };
  drawerBody.appendChild(placeholder);

  drawerContent.appendChild(drawerBody);
  drawerRoot.appendChild(drawerContent);
  rootElement.appendChild(drawerRoot);

  // Store row data for details view
  rowDataByUri.set(uri, dataTableRows);

  if (editAction?.instruction) {
    editInstructionByUri.set(uri, editAction.instruction);
  }

  // Store direct reference to flex container so event handlers can find it
  // This is critical for nested data tables (created via createElementFromDefinition)
  // where the elements are in the parent's environment, not the data table's own URI
  flexContainerByUri.set(uri, rootElement);

  return { element: rootElement, uri, dataTableRows };
}

export function createDataTable(args: DataTableArgs) {
  const { title, showDetails = false } = args;

  // Use the helper to create the data table element structure
  const { element, uri } = createDataTableElement({
    ...args,
    columns: args.columns.map((col) => ({ key: col.key, label: col.label })),
  });

  if (showDetails) {
    // showDetails mode - element already includes drawer infrastructure
    // Row data and edit instructions are already stored by createDataTableElement
    return createRemoteDomResource(element, {
      name: "data-table",
      title: title || "Data Table",
      description: title,
      uri, // Pass in the URI from the helper
    });
  }

  // No details mode - wrap in card if title provided
  if (title) {
    const cardRoot = document.createElement(
      "nimbus-card-root"
    ) as RemoteDomElement;
    cardRoot.elevation = "elevated";
    cardRoot.styleProps = {
      width: "100%",
      maxWidth: "100%",
    };

    const cardHeader = document.createElement(
      "nimbus-card-header"
    ) as RemoteDomElement;
    const heading = document.createElement(
      "nimbus-heading"
    ) as RemoteDomElement;
    heading.size = "lg";
    heading.textContent = title;
    cardHeader.appendChild(heading);
    cardRoot.appendChild(cardHeader);

    const cardContent = document.createElement(
      "nimbus-card-content"
    ) as RemoteDomElement;
    cardContent.appendChild(element);
    cardRoot.appendChild(cardContent);

    const { resource } = createRemoteDomResource(cardRoot, {
      name: "data-table",
      title: "Data Table",
      description: title,
    });

    return resource;
  }

  // Simple data table without title
  const { resource } = createRemoteDomResource(element, {
    name: "data-table",
    title: "Data Table",
    description: "Data table component",
  });

  return resource;
}

export function registerDataTableTool(
  server: McpServer,
  mutationServer?: {
    registerToolHandler: (
      toolName: string,
      handler: (toolName: string, params: Record<string, unknown>) => unknown
    ) => void;
  }
) {
  // Register tool handlers
  if (mutationServer) {
    mutationServer.registerToolHandler(
      "dataTableRowClick",
      (_toolName, params) => {
        const uri = params.uri as string;
        const rowId = params.rowId as string;
        handleDataTableRowClick(uri, rowId);
      }
    );

    mutationServer.registerToolHandler("drawerClose", (_toolName, params) => {
      const uri = params.uri as string;
      handleDrawerClose(uri);
    });

    // Handle button clicks for edit toggle and save buttons
    mutationServer.registerToolHandler("buttonClick", (_toolName, params) => {
      const buttonId = params.buttonId as string;
      const uri = params.uri as string;
      const formData = params.formData as Record<string, string> | undefined;

      // Handle edit toggle button
      if (buttonId === "edit-toggle") {
        handleToggleEditMode(uri);
        return null; // Handled by data table, no action queue
      }

      // Handle save changes button
      if (buttonId === "save-changes-button" && formData) {
        const handled = handleSaveChanges(uri, formData);
        // If save was handled (queued or error shown), don't fall through
        if (handled) {
          return null; // Save initiated, action queue will handle response
        }
        // If not handled, show error but don't fall through to button handler
        return null;
      }

      return handleButtonClick(buttonId, formData);
    });
  }

  server.registerTool(
    "createDataTable",
    {
      title: "Create Data Table",
      description:
        "Creates a data table UI component with headers and rows using Nimbus design system components. Set showDetails=true to enable click-to-view-details with inline editing. For editable tables, provide editAction.instruction with an instruction template for Claude to execute when saving (use {id} and {formData} placeholders). Example: editAction={ instruction: 'Update product {id} with this data: {formData}. Use commerce update_product tool.' }. IMPORTANT: Always provide a descriptive aria-label for accessibility. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        title: z.string().optional().describe("Table title"),
        columns: z
          .array(
            z.object({
              key: z.string().describe("Column key (matches row object keys)"),
              label: z.string().describe("Column header label"),
            })
          )
          .describe(
            "Array of column definitions (subset of rows shown in table)"
          ),
        rows: z
          .array(z.record(z.string(), z.any()))
          .describe(
            "Array of row objects (full data - table shows subset based on columns). IMPORTANT: if there are more keys than columns, set showDetails=true"
          ),
        ariaLabel: z
          .string()
          .describe(
            "Accessible label for the table (REQUIRED for accessibility)"
          ),
        showDetails: z
          .boolean()
          .optional()
          .describe(
            "Enable click-to-view-details functionality with inline editing. When true, clicking a row shows full row data in a drawer. IMPORTANT: When showDetails=true, you MUST also provide editAction to enable editing. Without editAction, the Edit button will show an error."
          ),
        editAction: z
          .object({
            instruction: z
              .string()
              .describe(
                "Instruction for Claude to execute when saving edits. Use placeholders {id} for row ID and {formData} for edited fields. Claude will construct the proper MCP tool call. Example: 'Update the product with ID {id} using this data: {formData}. Use the commerce update_product tool with proper actions array and version number.'"
              ),
          })
          .optional()
          .describe(
            "Edit action configuration. REQUIRED when showDetails=true to enable the Edit/Save workflow. Provide an instruction template that Claude will execute, with {id} and {formData} placeholders."
          ),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args): Promise<CallToolResult> => {
      // Validate that editAction is provided when showDetails is enabled
      if (args.showDetails && !args.editAction?.instruction) {
        throw new Error(
          "editAction.instruction is REQUIRED when showDetails=true. " +
            "Provide an instruction template for Claude to execute when saving edits. " +
            "Example: editAction={ instruction: 'Update product {id} with data: {formData}. Use commerce update_product tool with proper actions array.' }. " +
            "Without it, the Edit button cannot save changes."
        );
      }

      const uiResource = createDataTable(args);
      return {
        // @ts-expect-error - createDataTable returns valid UIResource, TypeScript union type is too strict
        content: [uiResource],
      };
    }
  );
}
