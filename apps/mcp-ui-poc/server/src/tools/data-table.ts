import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { commonStyleSchema } from "../utils/common-schemas.js";
import { createElementFromDefinition } from "../utils/create-element-from-definition.js";
import { getRemoteEnvironment } from "../remote-dom/environment.js";

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
}

// Store full row data by URI for details view
const rowDataByUri = new Map<string, Record<string, unknown>[]>();

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

  console.log(`🔄 Showing details for row:`, rowData);
  updateDetailsDrawer(uri, rowData);
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

  // List all children
  Array.from(flexContainer.childNodes).forEach((child, idx) => {
    const el = child as Element;
    console.log(`  Child ${idx}: ${el.tagName}, ID: "${el.id || "no-id"}"`);
  });

  // Query for drawer and content within the flex container
  const drawer = flexContainer.querySelector(
    "#details-drawer"
  ) as RemoteDomElement | null;
  const detailsContent = flexContainer.querySelector(
    "#details-content"
  ) as Element | null;

  console.log("🔍 Drawer found?", !!drawer);
  console.log("🔍 Details content found?", !!detailsContent);

  if (!drawer || !detailsContent) {
    console.error("❌ Drawer not found in flex container");
    return;
  }

  // Open the drawer (triggers Remote DOM mutation)
  drawer.isOpen = true;
  console.log("✅ Drawer opened");

  // Flush mutations immediately to ensure drawer opens without delay
  env.flush();

  // Clear existing content
  while (detailsContent.firstChild) {
    detailsContent.removeChild(detailsContent.firstChild);
  }

  // Create stack for details
  const stack = document.createElement("nimbus-stack") as RemoteDomElement;
  stack.direction = "column";
  stack.styleProps = { gap: "300" };

  // Dynamically create fields for each property in row data
  Object.entries(rowData).forEach(([key, value]) => {
    if (key === "id") return; // Skip internal ID

    // Check if this is an image URL field
    const isImageField = /^(image|imageUrl|img|photo|picture|thumbnail)$/i.test(
      key
    );
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
    const valueText = document.createElement("nimbus-text") as RemoteDomElement;
    valueText.textContent = valueStr;
    fieldStack.appendChild(valueText);

    stack.appendChild(fieldStack);
  });

  detailsContent.appendChild(stack);
  console.log("✅ Drawer updated with details and opened");

  // Flush mutations to ensure content updates immediately
  env.flush();
}

export function createDataTable(args: DataTableArgs) {
  const { title, columns, data, ariaLabel, showDetails = false } = args;

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

    // Drawer header with title and close button
    const drawerHeader = document.createElement(
      "nimbus-drawer-header"
    ) as RemoteDomElement;

    const drawerTitle = document.createElement(
      "nimbus-drawer-title"
    ) as RemoteDomElement;
    drawerTitle.textContent = "Details";
    drawerHeader.appendChild(drawerTitle);

    const drawerClose = document.createElement(
      "nimbus-drawer-close-trigger"
    ) as RemoteDomElement;
    drawerClose.setAttribute("aria-label", "Close drawer");
    drawerHeader.appendChild(drawerClose);

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
  }

  server.registerTool(
    "createDataTable",
    {
      title: "Create Data Table",
      description:
        "Creates a data table UI component with headers and rows using Nimbus design system components. Set showDetails=true to enable click-to-view-details functionality. IMPORTANT: Always provide a descriptive aria-label for accessibility. Supports all Chakra UI style properties.",
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
            "Enable click-to-view-details functionality. When true, clicking a row shows full row data in details card below table."
          ),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args): Promise<CallToolResult> => {
      const uiResource = createDataTable(args);
      return {
        // @ts-expect-error - createDataTable returns valid UIResource, TypeScript union type is too strict
        content: [uiResource],
      };
    }
  );
}
