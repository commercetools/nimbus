import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { commonStyleSchema } from "../utils/common-schemas.js";
import { createElementFromDefinition } from "../utils/create-element-from-definition.js";
import { getRemoteEnvironment } from "../remote-dom/environment.js";
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
  data: Record<string, unknown>[];
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

/**
 * Handle drawer close events - set isOpen to false
 */
export function handleDrawerClose(uri: string) {
  console.log(`🚪 Closing drawer for URI: ${uri}`);

  const env = getRemoteEnvironment(uri);
  const root = env.getRoot() as Element;
  const flexContainer = root.firstChild as Element | null;

  if (!flexContainer) {
    console.error("❌ Flex container not found");
    return;
  }

  const drawer = flexContainer.querySelector(
    "#details-drawer"
  ) as RemoteDomElement | null;
  if (!drawer) {
    console.error("❌ Drawer not found");
    return;
  }

  // Close the drawer
  drawer.isOpen = false;
  console.log("✅ Drawer closed");

  // Flush mutations immediately
  env.flush();
}

/**
 * Handle toggle edit mode button click
 */
export function handleToggleEditMode(uri: string) {
  console.log(`🔄 Toggling edit mode for URI: ${uri}`);

  const editState = editModeByUri.get(uri);
  if (!editState) {
    console.error(`❌ No edit state found for URI: ${uri}`);
    return;
  }

  // Toggle edit mode
  editState.isEditMode = !editState.isEditMode;
  console.log(`✅ Edit mode is now: ${editState.isEditMode}`);

  // Re-render drawer content with current row
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
  console.log(`💾 Saving changes for URI: ${uri}`, formData);

  const editState = editModeByUri.get(uri);
  if (!editState || !editState.currentRowId) {
    console.error(`❌ No edit state or current row for URI: ${uri}`);
    return false;
  }

  const allData = rowDataByUri.get(uri);
  if (!allData) {
    console.error(`❌ No row data found for URI: ${uri}`);
    return false;
  }

  // Find the row to update
  const rowIndex = allData.findIndex(
    (row) => row.id === editState.currentRowId
  );
  if (rowIndex === -1) {
    console.error(`❌ Row not found: ${editState.currentRowId}`);
    return false;
  }

  const currentRow = allData[rowIndex];

  // Check if we have an edit instruction configured
  const instructionTemplate = editInstructionByUri.get(uri);

  if (!instructionTemplate) {
    console.error(`❌ No edit instruction configured for URI: ${uri}`);
    // Show error toast
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

  console.log(`🎯 Queueing update with instruction:`, instruction);

  // Queue with custom instruction instead of direct tool call
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
      // Callback executed when Claude completes the tool call
      if (error) {
        console.error(`❌ Error updating row:`, error);

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

      console.log(
        `✅ Commerce tool completed, updating table with result:`,
        result
      );

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

  // Show loading state (optimistic UI - could add spinner here)
  console.log(`⏳ Waiting for commerce tool response...`);
  return true;
}

/**
 * Handle row click events - dynamically populate details with ALL row data
 */
export function handleDataTableRowClick(uri: string, rowId: string) {
  console.log(`🔍 Looking for row data. URI: ${uri}, rowId: ${rowId}`);
  console.log(`🔍 Available URIs in storage:`, Array.from(rowDataByUri.keys()));

  const allData = rowDataByUri.get(uri);
  if (!allData) {
    console.error(`❌ No row data found for URI: ${uri}`);
    console.error(`📦 Stored URIs:`, Array.from(rowDataByUri.keys()));
    return;
  }

  console.log(`✅ Found ${allData.length} rows in storage`);

  const rowData = allData.find((row) => row.id === rowId);
  if (!rowData) {
    console.error(`❌ Row not found: ${rowId}`);
    console.error(
      `📋 Available row IDs:`,
      allData.map((r) => r.id)
    );
    return;
  }

  // Initialize edit state for this URI if not exists
  if (!editModeByUri.has(uri)) {
    editModeByUri.set(uri, { isEditMode: false, currentRowId: null });
  }

  // Update current row ID
  const editState = editModeByUri.get(uri)!;
  editState.currentRowId = String(rowData.id);
  editState.isEditMode = false; // Always start in view mode

  console.log(`🔄 Showing details for row:`, rowData);
  updateDetailsDrawer(uri, rowData);
}

/**
 * Update the data table with new row data
 */
function updateDataTable(uri: string, updatedData: Record<string, unknown>[]) {
  const env = getRemoteEnvironment(uri);
  const root = env.getRoot() as Element;
  const flexContainer = root.firstChild as Element | null;

  if (!flexContainer) {
    console.error("❌ Flex container not found");
    return;
  }

  const dataTable = flexContainer.querySelector(
    "nimbus-data-table"
  ) as RemoteDomElement | null;

  if (!dataTable) {
    console.error("❌ Data table not found");
    return;
  }

  // Log current state before update
  console.log("🔍 DataTable before update:", {
    hasColumns: !!dataTable.columns,
    hasRows: !!dataTable.rows,
    columnsType: typeof dataTable.columns,
    rowsType: typeof dataTable.rows,
  });

  // Update the rows property (columns should remain unchanged)
  dataTable.rows = JSON.stringify(updatedData);

  console.log("✅ Data table rows updated. New row count:", updatedData.length);
  console.log("🔍 DataTable after update:", {
    hasColumns: !!dataTable.columns,
    hasRows: !!dataTable.rows,
  });

  env.flush();
}

/**
 * Render drawer content in either view or edit mode
 */
function renderDrawerContent(
  uri: string,
  rowData: Record<string, unknown>,
  isEditMode: boolean
) {
  const env = getRemoteEnvironment(uri);
  const root = env.getRoot() as Element;
  const flexContainer = root.firstChild as Element | null;

  if (!flexContainer) {
    console.error("❌ Flex container not found");
    return;
  }

  const detailsContent = flexContainer.querySelector(
    "#details-content"
  ) as Element | null;

  if (!detailsContent) {
    console.error("❌ Details content not found");
    return;
  }

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

  console.log(
    `✅ Drawer content rendered in ${isEditMode ? "edit" : "view"} mode`
  );
  env.flush();
}

/**
 * Dynamically update drawer with row data and open it
 */
function updateDetailsDrawer(uri: string, rowData: Record<string, unknown>) {
  const env = getRemoteEnvironment(uri);
  const root = env.getRoot() as Element;

  console.log("🔍 Environment root children:", root.childNodes.length);

  // Our rootElement (nimbus-flex) is the first child of the environment root
  const flexContainer = root.firstChild as Element | null;
  if (!flexContainer) {
    console.error("❌ Flex container not found in root");
    return;
  }

  console.log("🔍 Flex container found:", flexContainer.tagName);
  console.log("🔍 Flex container children:", flexContainer.childNodes.length);

  // Query for drawer within the flex container
  const drawer = flexContainer.querySelector(
    "#details-drawer"
  ) as RemoteDomElement | null;

  console.log("🔍 Drawer found?", !!drawer);

  if (!drawer) {
    console.error("❌ Drawer not found in flex container");
    return;
  }

  // Open the drawer (triggers Remote DOM mutation)
  drawer.isOpen = true;
  console.log("✅ Drawer opened");

  // Flush mutations immediately to ensure drawer opens without delay
  env.flush();

  // Render content in view mode (not edit mode by default)
  renderDrawerContent(uri, rowData, false);
}

export function createDataTable(args: DataTableArgs) {
  const {
    title,
    columns,
    data,
    ariaLabel,
    showDetails = false,
    editAction,
  } = args;

  console.log(`🔧 Creating data table with showDetails=${showDetails}`);

  // Transform column definitions to DataTable format
  const dataTableColumns = columns.map((col) => ({
    id: col.key,
    header: col.label,
    accessor: `(row) => row['${col.key}']`,
  }));

  // Transform data rows to include id field and preserve ALL original data
  const dataTableRows = data.map((row, idx) => ({
    id: row.id ? String(row.id) : `row-${idx}`,
    ...row,
  }));

  // Create root container if showDetails is enabled
  const rootElement = showDetails
    ? (document.createElement("nimbus-flex") as RemoteDomElement)
    : null;

  console.log(
    `🔧 Root element created? ${!!rootElement} (showDetails=${showDetails})`
  );

  if (rootElement) {
    console.log("✅ Configuring root container");
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
  }

  // Create DataTable element
  const dataTableDef = {
    type: "nimbus-data-table",
    properties: {
      columns: JSON.stringify(dataTableColumns),
      rows: JSON.stringify(dataTableRows),
      allowsSorting: true,
      isRowClickable: showDetails, // Make clickable only if details enabled
      density: "default",
      width: "100%",
      "aria-label": ariaLabel,
    },
  };

  const dataTableElement = createElementFromDefinition(dataTableDef);

  // If showDetails, add drawer for details view
  if (showDetails && rootElement) {
    console.log("✅ Adding drawer for details view (showDetails=true)");
    rootElement.appendChild(dataTableElement);

    // Create drawer (controlled mode for programmatic control)
    const drawerRoot = document.createElement(
      "nimbus-drawer-root"
    ) as RemoteDomElement;
    drawerRoot.setAttribute("id", "details-drawer");
    drawerRoot.isOpen = false; // Start closed
    drawerRoot.isDismissable = true; // Allow closing via backdrop/Escape

    // Add hidden trigger (required for DialogTrigger to activate isOpen prop)
    const drawerTrigger = document.createElement(
      "nimbus-drawer-trigger"
    ) as RemoteDomElement;
    drawerTrigger.styleProps = {
      display: "none", // Hidden - we control via isOpen, not user clicks
    };
    const triggerText = document.createElement(
      "nimbus-text"
    ) as RemoteDomElement;
    triggerText.textContent = "Open Details"; // Screen reader text
    drawerTrigger.appendChild(triggerText);
    drawerRoot.appendChild(drawerTrigger);

    // Drawer content
    const drawerContent = document.createElement(
      "nimbus-drawer-content"
    ) as RemoteDomElement;
    drawerContent.size = "md";
    drawerContent.placement = "end"; // Slide from right

    // Drawer header with title, edit button, and close button
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

    // Create flex container for edit button and close button
    const headerActions = document.createElement(
      "nimbus-flex"
    ) as RemoteDomElement;
    headerActions.direction = "row";
    headerActions.styleProps = { gap: "200", alignItems: "center" };

    // Add edit/view toggle button
    const editToggle = document.createElement(
      "nimbus-button"
    ) as RemoteDomElement;
    editToggle.setAttribute("id", "edit-toggle");
    editToggle.variant = "ghost";
    editToggle.size = "sm";
    const editToggleText = document.createTextNode("Edit");
    editToggle.appendChild(editToggleText);
    headerActions.appendChild(editToggle);

    const drawerClose = document.createElement(
      "nimbus-drawer-close-trigger"
    ) as RemoteDomElement;
    drawerClose.setAttribute("aria-label", "Close drawer");
    headerActions.appendChild(drawerClose);

    drawerHeader.appendChild(headerActions);
    drawerContent.appendChild(drawerHeader);

    // Drawer body (where details content will be rendered)
    const drawerBody = document.createElement(
      "nimbus-drawer-body"
    ) as RemoteDomElement;
    drawerBody.setAttribute("id", "details-content");

    const placeholder = document.createElement(
      "nimbus-text"
    ) as RemoteDomElement;
    placeholder.textContent = "Click a row to view details";
    placeholder.styleProps = { color: "neutral.11" };
    drawerBody.appendChild(placeholder);

    drawerContent.appendChild(drawerBody);
    drawerRoot.appendChild(drawerContent);
    rootElement.appendChild(drawerRoot);

    // Generate URI first so we can store row data
    const uri = `ui://data-table/${Date.now()}`;

    // Store full row data BEFORE creating resource
    rowDataByUri.set(uri, dataTableRows);
    console.log(`📦 Stored ${dataTableRows.length} rows for URI: ${uri}`);

    // Store edit instruction if provided
    if (editAction?.instruction) {
      editInstructionByUri.set(uri, editAction.instruction);
      console.log(`🔧 Configured edit instruction for URI: ${uri}`);
    }

    // Create resource with pre-generated URI
    return createRemoteDomResource(rootElement, {
      name: "data-table",
      title: title || "Data Table",
      description: title,
      uri, // Pass in the URI we generated
    });
  }

  // No details mode - legacy behavior
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
    cardContent.appendChild(dataTableElement);
    cardRoot.appendChild(cardContent);

    const { resource } = createRemoteDomResource(cardRoot, {
      name: "data-table",
      title: "Data Table",
      description: title,
    });

    return resource;
  }

  const { resource } = createRemoteDomResource(dataTableElement, {
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

      console.log(`🖱️ DataTable button clicked: ${buttonId} for URI: ${uri}`);

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

      // Fall back to standard button handler for other buttons
      console.log(
        `ℹ️ Button ${buttonId} not handled by data table, forwarding to button handler`
      );
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
              key: z.string().describe("Column key (matches data object keys)"),
              label: z.string().describe("Column header label"),
            })
          )
          .describe(
            "Array of column definitions (subset of data shown in table)"
          ),
        data: z
          .array(z.record(z.string(), z.any()))
          .describe(
            "Array of data objects (full data - table shows subset based on columns). IMPORTANT: if there are more keys than columns, set showDetails=true"
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
