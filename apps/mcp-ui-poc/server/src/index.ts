import express from "express";
import cors from "cors";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import { createProductCard } from "./tools/product-card.js";
import { createSimpleForm } from "./tools/simple-form.js";
import { createFormField } from "./tools/form-field.js";
import { createDataTable } from "./tools/data-table.js";
import { createCard } from "./tools/card.js";
import { createText } from "./tools/text.js";
import { createTextInput } from "./tools/text-input.js";
import { createButton } from "./tools/button.js";
import { createBadge } from "./tools/badge.js";
import { createFlex } from "./tools/flex.js";
import { createStack } from "./tools/stack.js";
import { createHeading } from "./tools/heading.js";
import { createMoneyInput } from "./tools/money-input.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for MCP protocol
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id", "mcp-protocol-version"],
    allowedHeaders: ["Content-Type", "mcp-session-id", "mcp-protocol-version"],
  })
);
app.use(express.json());

// Session storage: Map of sessionId -> StreamableHTTPServerTransport
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// ============================================================
// HEALTH ENDPOINT (for Kubernetes probes)
// ============================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    server: "nimbus-mcp-ui-server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    activeSessions: Object.keys(transports).length,
  });
});

// ============================================================
// MCP PROTOCOL ENDPOINTS
// ============================================================

// POST /mcp - Handle client-to-server communication
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Session exists - reuse existing transport
    transport = transports[sessionId];
  } else if (sessionId && !transports[sessionId]) {
    // Session ID provided but doesn't exist - session expired or server restarted
    console.log(`❌ Invalid session ID ${sessionId} - session not found`);
    return res.status(404).json({
      jsonrpc: "2.0",
      error: {
        code: -32001,
        message: "Session not found. Please reconnect.",
      },
      id: req.body.id || null,
    });
  } else if (isInitializeRequest(req.body)) {
    // New session initialization request
    console.log(`🆕 Creating new MCP session...`);

    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log(`✅ MCP Session initialized: ${sid}`);
      },
    });

    // Clean up transport when session closes
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`🔌 MCP Session closed: ${transport.sessionId}`);
        delete transports[transport.sessionId];
      }
    };

    // Create new MCP server instance for this session
    const server = new McpServer({
      name: "nimbus-mcp-ui-server",
      version: "1.0.0",
    });

    // Register tools on the MCP server
    registerTools(server);

    // Connect server to transport
    await server.connect(transport);
  } else {
    // No session ID and not an initialization request
    console.log(`❌ No session ID provided and not an initialization request`);
    return res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message:
          "Bad Request: No session ID provided. Please initialize a session first.",
      },
      id: req.body.id || null,
    });
  }

  // Handle the request using the transport
  await transport.handleRequest(req, res, req.body);
});

// GET /mcp - Long-lived stream for server-to-client messages
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    return res.status(404).send("Session not found");
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

// DELETE /mcp - Explicit session termination
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    return res.status(404).send("Session not found");
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

// ============================================================
// CHILD ELEMENT SCHEMAS
// ============================================================

// Base schemas for child elements (recursive)
const childElementSchema: z.ZodTypeAny = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("heading"),
      content: z.string(),
      size: z.string().optional(),
      marginBottom: z.string().optional(),
    }),
    z.object({
      type: z.literal("text"),
      content: z.string(),
      fontSize: z.string().optional(),
      fontWeight: z.string().optional(),
      color: z.string().optional(),
      marginBottom: z.string().optional(),
    }),
    z.object({
      type: z.literal("button"),
      label: z.string(),
      variant: z.string().optional(),
      colorPalette: z.string().optional(),
      width: z.string().optional(),
      isDisabled: z.boolean().optional(),
      buttonType: z.enum(["button", "submit", "reset"]).optional(),
      ariaLabel: z.string().optional(),
    }),
    z.object({
      type: z.literal("badge"),
      label: z.string(),
      colorPalette: z.string().optional(),
      size: z.string().optional(),
      width: z.string().optional(),
    }),
    z.object({
      type: z.literal("stack"),
      direction: z.string().optional(),
      gap: z.string().optional(),
      width: z.string().optional(),
      marginBottom: z.string().optional(),
      children: z.array(childElementSchema).optional(),
      as: z.enum(["div", "form"]).optional(),
      action: z.string().optional(),
      method: z.enum(["get", "post"]).optional(),
      enctype: z
        .enum([
          "application/x-www-form-urlencoded",
          "multipart/form-data",
          "text/plain",
        ])
        .optional(),
    }),
    z.object({
      type: z.literal("flex"),
      direction: z.string().optional(),
      gap: z.string().optional(),
      padding: z.string().optional(),
      backgroundColor: z.string().optional(),
      children: z.array(childElementSchema).optional(),
      as: z.enum(["div", "form"]).optional(),
      action: z.string().optional(),
      method: z.enum(["get", "post"]).optional(),
      enctype: z
        .enum([
          "application/x-www-form-urlencoded",
          "multipart/form-data",
          "text/plain",
        ])
        .optional(),
    }),
    z.object({
      type: z.literal("card"),
      elevation: z.string().optional(),
      borderStyle: z.string().optional(),
      cardPadding: z.string().optional(),
      maxWidth: z.string().optional(),
      width: z.string().optional(),
      children: z.array(childElementSchema).optional(),
    }),
    z.object({
      type: z.literal("formField"),
      labelChildren: z.array(childElementSchema),
      inputChildren: z.array(childElementSchema),
      description: z.string().optional(),
      errorMessage: z.string().optional(),
      isRequired: z.boolean().optional(),
      isInvalid: z.boolean().optional(),
      isDisabled: z.boolean().optional(),
      isReadOnly: z.boolean().optional(),
      size: z.string().optional(),
      direction: z.string().optional(),
    }),
    z.object({
      type: z.literal("textInput"),
      name: z.string().optional(),
      placeholder: z.string().optional(),
      defaultValue: z.string().optional(),
      isRequired: z.boolean().optional(),
      isDisabled: z.boolean().optional(),
      isReadOnly: z.boolean().optional(),
      inputType: z.string().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
      min: z.union([z.number(), z.string()]).optional(),
      max: z.union([z.number(), z.string()]).optional(),
      step: z.union([z.number(), z.string()]).optional(),
      accept: z.string().optional(),
      multiple: z.boolean().optional(),
      autoComplete: z.string().optional(),
      ariaLabel: z.string().optional(),
    }),
    z.object({
      type: z.literal("moneyInput"),
      name: z.string().optional(),
      currencyCode: z.string().optional(),
      amount: z.string().optional(),
      currencies: z.array(z.string()).optional(),
      placeholder: z.string().optional(),
      isRequired: z.boolean().optional(),
      isDisabled: z.boolean().optional(),
      isReadOnly: z.boolean().optional(),
      isInvalid: z.boolean().optional(),
      size: z.enum(["sm", "md"]).optional(),
      hasHighPrecisionBadge: z.boolean().optional(),
      isCurrencyInputDisabled: z.boolean().optional(),
      ariaLabel: z.string().optional(),
    }),
  ])
);

// ============================================================
// TOOL REGISTRATION
// ============================================================

function registerTools(server: McpServer) {
  server.registerTool(
    "createProductCard",
    {
      title: "Create Product Card",
      description:
        "Creates a product card UI component with name, price, description, image, and stock status using Nimbus design system components.",
      inputSchema: z.object({
        productId: z
          .string()
          .optional()
          .describe(
            "Optional unique product ID (auto-generated if not provided)"
          ),
        productName: z.string().describe("The name of the product"),
        price: z.string().describe("The price of the product (e.g., '$999')"),
        description: z
          .string()
          .optional()
          .describe("Optional product description"),
        imageUrl: z
          .string()
          .optional()
          .describe("Optional URL to product image"),
        inStock: z
          .boolean()
          .optional()
          .describe("Whether the product is in stock (default: true)"),
      }),
    },
    async (args) => {
      const uiResource = createProductCard(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createSimpleForm",
    {
      title: "Create Simple Form",
      description:
        "Creates a simple form UI component with text inputs and submit button using Nimbus design system components. NOTE: This is a convenience tool for VERY SIMPLE forms only. For more complex forms with custom layouts or additional components, compose your own form using createStack (with as='form'), createFormField, createTextInput, and createButton tools.",
      inputSchema: z.object({
        title: z.string().optional().describe("Form title"),
        fields: z
          .array(
            z.object({
              name: z
                .string()
                .describe("Field name (required for form submission)"),
              label: z.string().describe("Field label"),
              type: z
                .enum(["text", "email", "number", "password", "tel", "url"])
                .optional()
                .describe(
                  "Input type for validation and keyboard (default: 'text')"
                ),
              required: z
                .boolean()
                .optional()
                .describe("Whether field is required"),
              minLength: z.number().optional().describe("Minimum input length"),
              maxLength: z.number().optional().describe("Maximum input length"),
              pattern: z
                .string()
                .optional()
                .describe("Regex pattern for validation"),
            })
          )
          .describe("Array of form fields"),
        submitLabel: z
          .string()
          .optional()
          .describe("Submit button label (default: 'Submit')"),
        action: z
          .string()
          .optional()
          .describe(
            "Form submission URL. OPTIONAL - if omitted, form data will be displayed in a dialog on submit instead of navigating to a URL."
          ),
        method: z
          .enum(["get", "post"])
          .optional()
          .describe("HTTP method for form submission (default: 'post')"),
        enctype: z
          .enum([
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain",
          ])
          .optional()
          .describe(
            "Form encoding type (default: 'application/x-www-form-urlencoded')"
          ),
      }),
    },
    async (args) => {
      const uiResource = createSimpleForm(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createFormField",
    {
      title: "Create Form Field",
      description:
        "Creates a form field UI component with composable label and input sections, plus optional description and error message. Supports full composition for label and input content.",
      inputSchema: z.object({
        labelChildren: z
          .array(childElementSchema)
          .describe(
            "Array of child elements for the label. For simple text labels, use a single element: { type: 'text', content: 'Label text' }. Only use complex composition (with multiple elements, icons, etc.) when needed."
          ),
        inputChildren: z
          .array(childElementSchema)
          .describe(
            "Array of child elements for the input wrapper. MUST contain valid input elements with type discriminator 'textInput'. Typically a single element: { type: 'textInput', name: 'fieldName', placeholder: 'Enter value', inputType: 'email' }. The inputType property (optional) specifies the HTML input type (text, email, password, etc.)."
          ),
        description: z
          .string()
          .optional()
          .describe("Optional helper text displayed below the input"),
        errorMessage: z
          .string()
          .optional()
          .describe("Optional error message (shown when isInvalid is true)"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether the field is required (shows indicator)"),
        isInvalid: z
          .boolean()
          .optional()
          .describe("Whether the field has a validation error"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the field is disabled"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether the field is read-only"),
        size: z
          .enum(["sm", "md"])
          .optional()
          .describe("Size variant (default: 'md')"),
        direction: z
          .enum(["row", "column"])
          .optional()
          .describe("Layout direction (default: 'column')"),
      }),
    },
    async (args) => {
      const uiResource = createFormField(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createDataTable",
    {
      title: "Create Data Table",
      description:
        "Creates a data table UI component with headers and rows using Nimbus design system components. IMPORTANT: Always provide a descriptive aria-label for accessibility.",
      inputSchema: z.object({
        title: z.string().optional().describe("Table title"),
        columns: z
          .array(
            z.object({
              key: z.string().describe("Column key (matches data object keys)"),
              label: z.string().describe("Column header label"),
            })
          )
          .describe("Array of column definitions"),
        data: z.array(z.record(z.any())).describe("Array of data objects"),
        ariaLabel: z
          .string()
          .describe(
            "Accessible label for the table (REQUIRED for accessibility)"
          ),
      }),
    },
    async (args) => {
      const uiResource = createDataTable(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createCard",
    {
      title: "Create Card",
      description:
        "Creates a card UI component using Nimbus design system. Can contain child elements for composition.",
      inputSchema: z.object({
        content: z.string().optional().describe("Card content text"),
        elevation: z
          .string()
          .optional()
          .describe("Card elevation (e.g., 'elevated', 'flat')"),
        borderStyle: z
          .string()
          .optional()
          .describe("Border style (e.g., 'outlined', 'none')"),
        cardPadding: z.string().optional().describe("Card padding size"),
        maxWidth: z
          .string()
          .optional()
          .describe("Maximum width (e.g., '432px')"),
        width: z
          .string()
          .optional()
          .describe("Width (e.g., 'fit-content', 'full')"),
        children: z
          .array(childElementSchema)
          .optional()
          .describe("Array of child elements to nest inside the card"),
      }),
    },
    async (args) => {
      const uiResource = createCard(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createText",
    {
      title: "Create Text",
      description: "Creates a text UI component using Nimbus design system.",
      inputSchema: z.object({
        content: z.string().describe("Text content to display"),
        fontSize: z
          .string()
          .optional()
          .describe("Font size (e.g., 'sm', 'md', 'lg', 'xl')"),
        fontWeight: z
          .string()
          .optional()
          .describe("Font weight (e.g., 'normal', 'bold')"),
        color: z.string().optional().describe("Text color"),
        marginBottom: z.string().optional().describe("Bottom margin"),
      }),
    },
    async (args) => {
      const uiResource = createText(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createTextInput",
    {
      title: "Create Text Input",
      description:
        "Creates a text input UI component using Nimbus design system. Can be used standalone or composed inside FormField.Input. Supports HTML5 validation attributes for native browser validation in forms.",
      inputSchema: z.object({
        name: z
          .string()
          .optional()
          .describe(
            "Input name attribute for form submission (CRITICAL for HTML forms)"
          ),
        placeholder: z
          .string()
          .optional()
          .describe("Placeholder text shown when input is empty"),
        defaultValue: z
          .string()
          .optional()
          .describe("Initial/default value for the input"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether the input is required"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the input is disabled"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether the input is read-only"),
        type: z
          .enum([
            "text",
            "email",
            "url",
            "tel",
            "password",
            "search",
            "number",
            "date",
            "time",
            "datetime-local",
            "month",
            "week",
            "file",
          ])
          .optional()
          .describe("Input type for validation and keyboard (default: 'text')"),
        minLength: z
          .number()
          .optional()
          .describe("Minimum input length for validation"),
        maxLength: z
          .number()
          .optional()
          .describe("Maximum input length for validation"),
        pattern: z.string().optional().describe("Regex pattern for validation"),
        min: z
          .union([z.number(), z.string()])
          .optional()
          .describe("Minimum value (for number/date inputs)"),
        max: z
          .union([z.number(), z.string()])
          .optional()
          .describe("Maximum value (for number/date inputs)"),
        step: z
          .union([z.number(), z.string()])
          .optional()
          .describe("Step value (for number inputs)"),
        accept: z
          .string()
          .optional()
          .describe("Accepted file types (for file inputs, e.g., 'image/*')"),
        multiple: z
          .boolean()
          .optional()
          .describe("Allow multiple values (for file/email inputs)"),
        autoComplete: z
          .string()
          .optional()
          .describe(
            "Autocomplete hint (e.g., 'email', 'username', 'current-password')"
          ),
        ariaLabel: z
          .string()
          .optional()
          .describe("Accessible label for the input"),
      }),
    },
    async (args) => {
      const uiResource = createTextInput(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createButton",
    {
      title: "Create Button",
      description:
        "Creates a button UI component using Nimbus design system. Supports HTML form submission types.",
      inputSchema: z.object({
        label: z.string().describe("Button label text"),
        variant: z
          .string()
          .optional()
          .describe("Button variant (e.g., 'solid', 'outline', 'ghost')"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'critical')"),
        width: z.string().optional().describe("Button width"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the button is disabled"),
        type: z
          .enum(["button", "submit", "reset"])
          .optional()
          .describe(
            "Button type for HTML forms (default: 'button'). Use 'submit' for form submission buttons."
          ),
        ariaLabel: z
          .string()
          .optional()
          .describe(
            "Accessible label for the button (overrides visible label for screen readers)"
          ),
      }),
    },
    async (args) => {
      const uiResource = createButton(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createBadge",
    {
      title: "Create Badge",
      description: "Creates a badge UI component using Nimbus design system.",
      inputSchema: z.object({
        label: z.string().describe("Badge label text"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'positive', 'critical')"),
        size: z
          .string()
          .optional()
          .describe("Badge size (e.g., '2xs', 'xs', 'sm', 'md')"),
        width: z.string().optional().describe("Badge width"),
      }),
    },
    async (args) => {
      const uiResource = createBadge(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createFlex",
    {
      title: "Create Flex",
      description:
        "Creates a flex layout container UI component using Nimbus design system. Can contain child elements for composition. Can be rendered as an HTML <form> element for native form submission.",
      inputSchema: z.object({
        content: z.string().optional().describe("Flex content text"),
        direction: z
          .string()
          .optional()
          .describe("Flex direction (e.g., 'row', 'column')"),
        gap: z.string().optional().describe("Gap between items"),
        padding: z.string().optional().describe("Container padding"),
        backgroundColor: z.string().optional().describe("Background color"),
        children: z
          .array(childElementSchema)
          .optional()
          .describe(
            "Array of child elements to nest inside the flex container"
          ),
        as: z
          .enum(["div", "form"])
          .optional()
          .describe(
            "Render as HTML element (default: 'div'). Use 'form' for native HTML form submission."
          ),
        action: z
          .string()
          .optional()
          .describe(
            "Form submission URL (only used when as='form'). OPTIONAL - if omitted, form data will be displayed in a dialog on submit."
          ),
        method: z
          .enum(["get", "post"])
          .optional()
          .describe(
            "HTTP method for form submission (only used when as='form')"
          ),
        enctype: z
          .enum([
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain",
          ])
          .optional()
          .describe("Form encoding type (only used when as='form')"),
      }),
    },
    async (args) => {
      const uiResource = createFlex(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createStack",
    {
      title: "Create Stack",
      description:
        "Creates a stack layout container UI component using Nimbus design system. Can contain child elements for composition. Can be rendered as an HTML <form> element for native form submission.",
      inputSchema: z.object({
        content: z.string().optional().describe("Stack content text"),
        direction: z
          .string()
          .optional()
          .describe("Stack direction (e.g., 'row', 'column')"),
        gap: z.string().optional().describe("Gap between items"),
        width: z.string().optional().describe("Stack width"),
        marginBottom: z.string().optional().describe("Bottom margin"),
        children: z
          .array(childElementSchema)
          .optional()
          .describe(
            "Array of child elements to nest inside the stack container"
          ),
        as: z
          .enum(["div", "form"])
          .optional()
          .describe(
            "Render as HTML element (default: 'div'). Use 'form' for native HTML form submission."
          ),
        action: z
          .string()
          .optional()
          .describe(
            "Form submission URL (only used when as='form'). OPTIONAL - if omitted, form data will be displayed in a dialog on submit."
          ),
        method: z
          .enum(["get", "post"])
          .optional()
          .describe(
            "HTTP method for form submission (only used when as='form')"
          ),
        enctype: z
          .enum([
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain",
          ])
          .optional()
          .describe("Form encoding type (only used when as='form')"),
      }),
    },
    async (args) => {
      const uiResource = createStack(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createHeading",
    {
      title: "Create Heading",
      description: "Creates a heading UI component using Nimbus design system.",
      inputSchema: z.object({
        content: z.string().describe("Heading text content"),
        size: z
          .string()
          .optional()
          .describe("Heading size (e.g., 'xs', 'sm', 'md', 'lg', 'xl')"),
        marginBottom: z.string().optional().describe("Bottom margin"),
      }),
    },
    async (args) => {
      const uiResource = createHeading(args);
      return {
        content: [uiResource],
      };
    }
  );

  server.registerTool(
    "createMoneyInput",
    {
      title: "Create Money Input",
      description:
        "Creates a money input UI component using Nimbus design system. Handles currency and amount input with support for multiple currencies. Can be used standalone or composed inside FormField.Input.",
      inputSchema: z.object({
        name: z
          .string()
          .optional()
          .describe(
            "Input name attribute prefix for form submission (creates ${name}.amount and ${name}.currencyCode fields)"
          ),
        currencyCode: z
          .string()
          .optional()
          .describe(
            "Initial currency code (e.g., 'USD', 'EUR', 'GBP'). Default: 'USD'"
          ),
        amount: z
          .string()
          .optional()
          .describe("Initial amount value as string (e.g., '100.00')"),
        currencies: z
          .array(z.string())
          .optional()
          .describe(
            "Array of available currency codes for dropdown. If not provided or empty, shows a label instead of dropdown."
          ),
        placeholder: z
          .string()
          .optional()
          .describe("Placeholder text for the amount input"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether the input is required"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the input is disabled"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether the input is read-only"),
        isInvalid: z
          .boolean()
          .optional()
          .describe("Whether the input has validation errors"),
        size: z
          .enum(["sm", "md"])
          .optional()
          .describe("Size variant (default: 'md')"),
        hasHighPrecisionBadge: z
          .boolean()
          .optional()
          .describe(
            "Shows high precision badge when value uses high precision"
          ),
        isCurrencyInputDisabled: z
          .boolean()
          .optional()
          .describe(
            "Disables only the currency dropdown/label while keeping amount input enabled"
          ),
        ariaLabel: z
          .string()
          .optional()
          .describe("Accessible label for the input"),
      }),
    },
    async (args) => {
      const uiResource = createMoneyInput(args);
      return {
        content: [uiResource],
      };
    }
  );
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP-UI Server running on port ${PORT}`);
  console.log(`💚 Health endpoint: http://localhost:${PORT}/health`);
  console.log(`🔌 MCP endpoint: http://localhost:${PORT}/mcp`);
});
